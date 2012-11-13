'use strict';

// Assuming p is prime, calculates Phi(p^k) quickly.
function calculateEulerPhiPrimePower(p, k) {
  p = SNat.cast(p);
  k = SNat.cast(k);

  return p.pow(k.minus(1)).times(p.minus(1));
}

// Calculates Phi(n) by factorizing it.
function calculateEulerPhi(n, factorizer) {
  n = SNat.cast(n);
  factorizer = factorizer || defaultFactorizer;

  var eulerPhi = new SNat(1);
  factorizer(n, function(p, k) {
    eulerPhi = eulerPhi.times(calculateEulerPhiPrimePower(p, k));
    return true;
  });
  return eulerPhi;
}