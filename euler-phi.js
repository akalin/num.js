'use strict';

// Assuming p is prime, calculates Phi(p^k) quickly.
function calculateEulerPhiPrimePower(p, k) {
  p = SNat.cast(p);
  k = SNat.cast(k);

  return p.pow(k.minus(1)).times(p.minus(1));
}
