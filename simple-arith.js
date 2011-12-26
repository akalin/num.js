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

// Returns a random SNat in [min, max).  min should be less than max.
// rng should be a function that returns a random double in [0, 1)
// with at least 32 bits of randomness.  If rng is not specified,
// Math.random is used.
SNat.random = function(min, max, rng) {
  min = SNat.cast(min);
  max = SNat.cast(max);
  rng = rng || Math.random;

  if (min.ge(max)) {
    throw 'invalid range [' + min + ', ' + max + ')';;
  }

  var delta = max.minus(min);

  // Generate a random rational number p/q in [0, 1) with enough
  // precision to map to [0, delta) when multiplied by delta, i.e. q
  // >= delta.  We do this by essentially generating digits of a 2^32
  // base number from rng.
  var uint32Base = ((1 << 31) >>> 0) * 2;
  var p = new SNat(0);
  var q = new SNat(1);
  while (q.lt(delta)) {
    var n = (rng() * uint32Base) >>> 0;
    p = p.times(uint32Base).plus(n);
    q = q.times(uint32Base);
  }

  return min.plus(delta.times(p).div(q));
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

SNat.prototype.min = function(s) {
  s = this.constructor.cast(s);
  return this.le(s) ? this : s;
}

SNat.prototype.max = function(s) {
  s = this.constructor.cast(s);
  return this.ge(s) ? this : s;
}

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
  var op = function(x, y) { return x.times(y); };
  var id = new SNat(1);
  return this.genPow_(s, op, id);
};

// Returns this object raised to the sth power modulo m, which must be
// greater than 0.
SNat.prototype.powMod = function(s, m) {
  m = this.constructor.cast(m);

  var op = function(x, y) { return x.times(y).mod(m); };
  var id = new SNat(m.gt(1) ? 1 : 0);
  return this.genPow_(s, op, id);
};

// Returns the natural logarithm (base E) of this object as a double.
// Returns -Infinity if this object equals 0, and 0 if this object
// equals 1.  The integral part of the return value fits in 34 bits
// and thus is represented exactly by a double, but not necessarily a
// uint32.
SNat.prototype.ln = function() {
  var s = this.toString();

  // If this object is small enough to fit in a double without loss of
  // precision, just pass it through Math.log.
  if (this.le(Math.pow(2, 53))) {
    return Math.log(s);
  }

  // Otherwise, calculate the logarithm by combining the logarithms of
  // the base 10 mantissa and exponent.
  var m = parseFloat('.' + s);
  var e = s.length;
  return Math.log(m) + e * Math.LN10;
};

// Returns the greatest common divisor of this and s.
SNat.prototype.gcd = function(s) {
  s = this.constructor.cast(s);

  if (this.isZero() || s.isZero()) {
    throw new Error('gcd with zero');
  }

  var a = this;
  var b = s;
  while (b.isNonZero()) {
    var t = b;
    b = a.mod(b);
    a = t;
  }
  return a;
};

// Returns the least common multiple of this and s.
SNat.prototype.lcm = function(s) {
  s = this.constructor.cast(s);

  return this.div(this.gcd(s)).times(s);
};

// Returns the floor of the logarithm base 2 of this object as a
// double.  Returns -Infinity of this object equals 0.  The return
// value fits in 36 bits and thus is represented exactly by a double,
// but not necessarily a uint32.
SNat.prototype.floorLg = function() {
  if (this.isZero()) {
    return -Infinity;
  }
  // floorLg may be either an underestimate (if this is a small power
  // of 2) or an overestimate (if this is slightly less than a large
  // power of 2).
  var floorLg = Math.floor(this.ln() * Math.LOG2E);

  // Invariant: m = 2^floorLg.
  var m = (new SNat(2)).pow(floorLg);
  // Make sure this is >= m.
  while (m.gt(this)) {
    m = m.div(2);
    --floorLg;
  }

  // Invariant: n = 2^{floorLg+1}.
  var n = m.times(2);
  // Make sure this is < n.
  while (n.le(this)) {
    n = n.times(2);
    ++floorLg;
  }

  // Here we know m = 2^floorLg <= this < n = 2^{floorLg+1}, and
  // therefore floorLg is the largest integer <= lg(n), i.e. floorLg =
  // floor(lg(n)).
  return floorLg;
};

// Returns the ceil of the logarithm base 2 of this object as a
// double.  Returns -Infinity of this object equals 0.  The return
// value fits in 36 bits and thus is represented exactly by a double,
// but not necessarily a uint32.
SNat.prototype.ceilLg = function() {
  if (this.isZero()) {
    return -Infinity;
  }
  var ceilLg = this.floorLg();
  if ((new SNat(2)).pow(ceilLg).lt(this)) {
    ++ceilLg;
  }
  return ceilLg;
};

// Returns the largest integer r such that r.pow(s) <= this.
SNat.prototype.floorRoot = function(s) {
  s = this.constructor.cast(s);
  if (s.isZero()) {
    throw 'root by zero';
  }
  if (this.isZero()) {
    return new SNat(0);
  }
  var b = this.ceilLg();
  b = this.constructor.cast(b);
  // p = ceil(b/s).
  var p = b.div(s);
  if (!b.mod(s).isZero()) {
    p = p.plus(1);
  }
  var x = (new SNat(2)).pow(p);
  while (x.gt(1)) {
    // y = floor(((s-1)x + floor(this/x^{s-1}))/s).
    var y = s.minus(1).times(x).plus(this.div(x.pow(s.minus(1)))).div(s);
    if (y.ge(x)) {
      return x;
    }
    x = y;
  }
  return new SNat(1);
};

// SPoly is a simple polynomial class that uses an internal
// representation of an array of power/coefficient terms.

// An SNat has an array a_ of terms with non-zero coefficients sorted
// by increasing power.  (The coefficients do not necessarily have to
// be SNats, but they must obey the same interface.)  The powers must
// be non-negative integers.  For example, the SPoly representing
// x^200 + 3141592653589 is (assuming SNat coefficients)
//
//  { a_: [[0, new SNat('3141592653589')], [200, new SNat(1)]] },
//
// and the SNat representing 0 is just
//
//  { a_: [] }.

// Constructs a constant SPoly from the given argument.  If the
// argument is omitted, an SPoly representing 0 is constructed.
// Otherwise, the argument must be an object that obeys the SNat
// interface.
//
// n = new SPoly();               // 0
// n = new SPoly(new SNat(100));  // 100
function SPoly(c) {
  if (c == undefined) {
    return SPoly.new_([]);
  }
  return SPoly.new_([[new SNat(0), c]]);
}

// Private constructor.  Returns an SPoly object with the given array
// of power/coefficient terms but with terms with non-positive
// coefficients or negative powers stripped out.
SPoly.new_ = function(a) {
  function isNonDegenerate(term) {
    return term[1].isNonZero();
  }
  var n = Object.create(SPoly.prototype);
  n.a_ = a.filter(isNonDegenerate);
  return n;
};

// Comparison operators.

SPoly.prototype.eq = function(p) {
  var u = this.a_;
  var v = p.a_;
  var ul = u.length;
  var vl = v.length;
  if (ul != vl) return false;
  for (var j = 0; j < ul; ++j) {
    if (u[j][0].ne(v[j][0]) || u[j][1].ne(v[j][1])) return false;
  }
  return true;
};

SPoly.prototype.ne = function(p) {
  return !this.eq(p);
};

// Returns this polynomial multiplied by x^n.  n may be negative, but
// n must be an integer.
SPoly.prototype.shiftLeft = function(n) {
  function shiftTerm(term) {
    return [term[0].plus(n), term[1]];
  }
  return SPoly.new_(this.a_.map(shiftTerm));
};

// Returns this polynomial divided by x^n.  n may be negative, but n
// must be an integer.
SPoly.prototype.shiftRight = function(n) {
  function shiftTerm(term) {
    return term[0].ge(n) ? [term[0].minus(n), term[1]] : [term[0], new SNat(0)];
  }
  return SPoly.new_(this.a_.map(shiftTerm));
};

// Returns a human-readable string representation of the SPoly.
SPoly.prototype.toString = function() {
  function termToString(term) {
    var n = term[0];
    var c = term[1];
    if (n == 0) {
      return c.toString();
    }
    var nStr = 'x';
    if (n.gt(1)) {
      nStr += '^' + n.toString();
    }
    return c.eq(1) ? nStr : (c.toString() + nStr);
  }
  return this.a_.map(termToString).reverse().join('+') || '0';
};
