'use strict';

// Workaround for IE <9 not supporting Array.map.  Adapted from
// http://stackoverflow.com/questions/2790001/fixing-javascript-array-functions-in-internet-explorer-indexof-foreach-etc
// .
if (!Array.prototype.map) {
  Array.prototype.map = function(mapper, that) {
    var n = this.length;
    var other = new Array(n);
    for (var i = 0; i < n; ++i) {
      if (i in this) {
        other[i] = mapper.call(that, this[i], i, this);
      }
    }
    return other;
  };
}

// Workaround for IE <9 not supporting Object.create.  Taken from
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/create/
// .
if (!Object.create) {
  Object.create = function (o) {
    if (arguments.length > 1) {
      throw new Error(
        'Object.create implementation only accepts the first parameter.');
    }
    function F() {}
    F.prototype = o;
    return new F();
  };
}

// SNat is a simple arbitrary-precision natural number class that uses
// an internal representation of an array of decimal digits.

// An SNat has an array a_ of decimal digits 0-9 with the *least*
// significant digit first and with all trailing 0 elements stripped.
// For example, the SNat representing 31415926 is
//
//  { a_: [6, 2, 9, 5, 1, 4, 1, 3] },
//
// and the SNat representing 0 is just
//
//  { a_: [] }.

// Constructs an SNat from the given argument.  If the argument is
// omitted, an SNat representing 0 is constructed.  Otherwise, the
// argument must have a toString() method that returns a non-empty
// string of decimal digits.
//
// n = new SNat();      // 0
// n = new SNat(100);   // 100
// n = new SNat(0xff);  // 255
// n = new SNat(039);   // 39 (not interpreted as octal)
// n = new SNat('');    // error
// n = new SNat({});    // error
function SNat(o) {
  if (o == undefined) {
    return SNat.new_([]);
  }

  // If o is another SNat, we can simply copy the underlying array
  // instead of stringifying/destringifying.
  if (o instanceof SNat) {
    return SNat.new_(o.a_.slice(0));
  }

  function parseDigit(d) {
    return parseInt(d, 10);
  }
  var s = o.toString();
  if (!s.match(/^[0-9]+$/)) {
    throw new Error('cannot parse ' + s);
  }
  return SNat.new_(s.split('').reverse().map(parseDigit));
}

// If the given object is already an SNat, returns it.  Otherwise,
// makes a new SNat out of it and returns that.
SNat.cast = function(o) {
  return (o instanceof SNat) ? o : new SNat(o);
};

// Like SNat.cast, but returns null instead of throwing an exception
// if the given object could not be parsed as an SNat.
SNat.tryCast = function(o) {
  try {
    return SNat.cast(o);
  } catch (e) {
    if (e instanceof Error && /^cannot parse /.test(e.message)) {
      return null;
    }
    throw e;
  }
};

// Our base.
SNat.prototype.b_ = 10;

// Private constructor.  Returns an SNat object with the given array
// of decimal digits, which may include trailing zeroes.
SNat.new_ = function(a) {
  // Trim trailing zeroes.
  while (a.length > 0 && a[a.length-1] == 0) {
    --a.length;
  }
  var n = Object.create(SNat.prototype);
  n.a_ = a;
  return n;
};

// In the functions below, arguments are converted to SNats when
// necessary.

// Returns a number less than, equal to, or greater than 0 according
// as this is less than, equal to, or greater than s.
SNat.prototype.cmp_ = function(s) {
  s = this.constructor.cast(s);

  var u = this.a_;
  var v = s.a_;
  var ul = u.length;
  var vl = v.length;
  if (ul < vl) return -1;
  if (ul > vl) return +1;
  for (var j = ul - 1; j >= 0; --j) {
    if (u[j] < v[j]) return -1;
    if (u[j] > v[j]) return +1;
  }
  return 0;
};

// Returns a dictionary with the quotient ('q') and remainder ('r')
// of this object and s, which must be greater than 0.
SNat.prototype.divMod_ = function(s) {
  s = this.constructor.cast(s);

  if (s.isZero()) {
    throw new Error('division by zero');
  }

  // Degenerate case.
  if (this.lt(s)) {
    return {
      q: new SNat(0),
      r: new SNat(this)
    };
  }

  // Adapted (loosely) from Knuth 4.3.1 Algorithm D; this is
  // actually closer to pen-and-paper long division.
  var u = this.a_;
  var v = s.a_;
  var n = v.length;
  var m = u.length - n;
  var q = new Array(m+1);
  // rem is the portion of u that we're currently dividing by v; at
  // the end of the loop below it becomes the actual remainder.
  var rem = this.constructor.new_(u.slice(m+1));
  var b = this.b_;
  for (var j = m; j >= 0; --j) {
    // Bring down the next digit.  Passing it through new_()
    // guarantees its trimmed of trailing zeroes.
    {
      var r = rem.a_;
      r.unshift(u[j]);
      rem = this.constructor.new_(r);
    }
    // Since our base is so small, we can get away with finding q[j]
    // by brute force instead of the somewhat tricky method in
    // Algorithm D.
    q[j] = 0;
    var vqj = new SNat(0);
    while (q[j] < b-1) {
      var t = vqj.plus(s);
      if (t.gt(rem)) {
        break;
      }
      ++q[j];
      vqj = t;
    }
    rem = rem.minus(vqj);
  }

  return { q: this.constructor.new_(q), r: rem };
};

// Returns this object raised to the nth power with the given
// multiplication operation and identity, where 0 <= n < 16 must hold.
// If this object and n are both 0, returns the identity.
SNat.prototype.genPow16_ = function(n, op, id) {
  // Left-to-right binary exponentiation as described in Knuth 4.6.3.
  var y = id;
  for (var i = 3; i >= 0; --i) {
    y = op(y, y);
    if ((n & (1 << i)) != 0) {
      y = op(y, this);
    }
  }
  return y;
};

// Returns this object raised to the sth power with the given
// multiplication operation and identity.  If this object and s are
// both 0, returns the identity.
SNat.prototype.genPow_ = function(s, op, id) {
  s = this.constructor.cast(s);
  id = this.constructor.cast(id);

  // Adapted left-to-right 10-ary exponentation as described in Knuth
  // 4.6.3.
  var n = s.a_;
  var y = id;
  var b = this.b_;
  var powCache = new Array(b);
  for (var i = n.length - 1; i >= 0; --i) {
    y = y.genPow16_(b, op, id);
    if (powCache[n[i]] == undefined) {
      powCache[n[i]] = this.genPow16_(n[i], op, id);
    }
    y = op(y, powCache[n[i]]);
  }
  return y;
};

// Returns the decimal string representation of the SNat.
SNat.prototype.toString = function() {
  // Make a copy since reverse() mutates its calling array object.
  return (this.a_.length > 0) ? this.a_.slice(0).reverse().join('') : '0';
};

// Comparison operators.

SNat.prototype.eq = function(s) {
  return this.cmp_(s) == 0;
};

SNat.prototype.ne = function(s) {
  return this.cmp_(s) != 0;
};

SNat.prototype.lt = function(s) {
  return this.cmp_(s) < 0;
};

SNat.prototype.le = function(s) {
  return this.cmp_(s) <= 0;
};

SNat.prototype.gt = function(s) {
  return this.cmp_(s) > 0;
};

SNat.prototype.ge = function(s) {
  return this.cmp_(s) >= 0;
};

SNat.prototype.isZero = function() {
  return this.a_.length == 0;
}

SNat.prototype.isNonZero = function() {
  return this.a_.length != 0;
}

SNat.prototype.isEven = function() {
  return this.isZero() || (this.a_[0] % 2 == 0);
}

SNat.prototype.isOdd = function() {
  return this.isNonZero() && (this.a_[0] % 2 != 0);
}

// Returns the sum of this object and s.
SNat.prototype.plus = function(s) {
  s = this.constructor.cast(s);

  // Adapted from Knuth 4.3.1 Algorithm A.
  var u = this.a_;
  var v = s.a_;
  var ul = u.length;
  var vl = v.length;
  var n = Math.max(ul, vl);
  var w = new Array(n+1);
  var b = this.b_;
  var k = 0;
  for (var j = 0; j < n; ++j) {
    var uj = (j < ul) ? u[j] : 0;
    var vj = (j < vl) ? v[j] : 0;
    var t = uj + vj + k;
    w[j] = t % b;
    k = Math.floor(t / b);
  }
  w[n] = k;

  return this.constructor.new_(w);
};

// Returns the difference of this object and s.  s must be less than
// or equal to this.
SNat.prototype.minus = function(s) {
  s = this.constructor.cast(s);

  // Adapted from Knuth 4.3.1 Algorithm S.
  var u = this.a_;
  var v = s.a_;
  var ul = u.length;
  var vl = v.length;
  var n = Math.max(ul, vl);
  var w = new Array(n);
  var b = this.b_;
  var k = 0;
  for (var j = 0; j < n; ++j) {
    var uj = (j < ul) ? u[j] : 0;
    var vj = (j < vl) ? v[j] : 0;
    var t = uj - vj + k;
    if (t < 0) {
      w[j] = t + b;
      k = -1;
    } else {
      w[j] = t;
      k = 0;
    }
  }
  if (k != 0) {
    throw new Error('tried to subtract larger number ' + s + ' from ' + this);
  }

  return this.constructor.new_(w);
};

// Returns the product of this object and s.
SNat.prototype.times = function(s) {
  s = this.constructor.cast(s);

  // Adapted from Knuth 4.3.1 Algorithm M.
  var u = this.a_;
  var v = s.a_;
  var m = u.length;
  var n = v.length;
  var w = new Array(m+n);
  for (var i = 0; i < m+n; ++i) {
    w[i] = 0;
  }
  var b = this.b_;
  var k = 0;
  for (var j = 0; j < n; ++j) {
    var k = 0;
    for (var i = 0; i < m; ++i) {
      var t = u[i] * v[j] + w[i+j] + k;
      w[i+j] = t % b;
      k = Math.floor(t / b);
    }
    w[j+m] = k;
  }

  return this.constructor.new_(w);
};

// Returns the quotient of this object and s, which must be greater
// than 0.
SNat.prototype.div = function(s) {
  return this.divMod_(s).q;
};

// Returns the modulo (remainder after division) of this object and
// s, which must be greater than 0.
SNat.prototype.mod = function(s) {
  return this.divMod_(s).r;
};

// Returns this object raised to the sth power.  If this object and s
// are both 0, returns 1.
SNat.prototype.pow = function(s) {
  return this.genPow_(s, function(x, y) { return x.times(y); }, new SNat(1));
};
