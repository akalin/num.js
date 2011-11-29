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

// If the given object is already an SNat, returns it.  Otherwise,
// makes a new SNat out of it and returns that.
SNat.cast_ = function(o) {
  return (o instanceof SNat) ? o : new SNat(o);
};

// Returns the decimal string representation of the SNat.
SNat.prototype.toString = function() {
  // Make a copy since reverse() mutates its calling array object.
  return (this.a_.length > 0) ? this.a_.slice(0).reverse().join('') : '0';
};

// In the functions below, arguments are converted to SNats when
// necessary.

// Returns the sum of this object and s.
SNat.prototype.plus = function(s) {
  s = this.constructor.cast_(s);

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
  s = this.constructor.cast_(s);

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
