'use strict';

// Assuming that a and n are coprime, returns the smallest power k of
// a such that a^k = 1 (mod n).  Performs O(n) multiplications of
// integers of lg n bits.
function calculateMultiplicativeOrderNaive(a, n) {
  a = SNat.cast(a);
  n = SNat.cast(n);

  var t = a.mod(n);
  var o = new SNat(1);
  while (t.ne(1)) {
    t = t.times(a).mod(n);
    o = o.plus(1);
  }

  return o;
}
