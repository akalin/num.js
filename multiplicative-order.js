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

// Assuming that a and p^k are coprime, returns the smallest power e
// of a such that a^e = 1 (mod p^k).  For each prime factor of p-1,
// takes O(lg^4 p / lg lg p) time.
function calculateMultiplicativeOrderPrimePower(a, p, k, factorizer) {
  a = SNat.cast(a);
  p = SNat.cast(p);
  k = SNat.cast(k);
  factorizer = factorizer || defaultFactorizer;

  var n = p.pow(k);

  var t = calculateEulerPhiPrimePower(p, k);

  var o = new SNat(1);
  function processPrimeFactor(q, e) {
    var x = a.powMod(t.div(q.pow(e)), n);
    while (x.ne(1)) {
      o = o.times(q);
      x = x.powMod(q, n);
    }
    return true;
  };

  if (k.gt(1)) {
    processPrimeFactor(p, k.minus(1));
  }
  factorizer(p.minus(1), processPrimeFactor);

  return o;
}
