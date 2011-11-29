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
    this.a_ = [];
    return;
  }

  // If o is another SNat, we can simply copy the underlying array
  // instead of stringifying/destringifying.
  if (o instanceof SNat) {
    this.a_ = o.a_.slice(0);
    return;
  }

  function parseDigit(d) {
    return parseInt(d, 10);
  }
  var s = o.toString();
  if (!s.match(/^[0-9]+$/)) {
    throw new Error('cannot parse ' + s);
  }
  this.a_ = s.replace(/^0*/, '').split('').reverse().map(parseDigit);
}

// Returns the decimal string representation of the SNat.
SNat.prototype.toString = function() {
  // Make a copy since reverse() mutates its calling array object.
  return (this.a_.length > 0) ? this.a_.slice(0).reverse().join('') : '0';
};
