'use strict';

// Given a number n, a generator function getNextDivisor, and a
// processing function processPrimeFactor, factors n using the
// divisors returned by genNextDivisor and passes each prime factor
// with its multiplicity to processPrimeFactor.
//
// getNextDivisor is passed the current unfactorized part of n and it
// should return the next divisor to try, or null if there are no more
// divisors to generate (although processPrimeFactor may still be
// called).  processPrimeFactor is called with each non-trivial prime
// factor and its multiplicity.  If it returns a false value, it won't
// be called anymore.
function trialDivide(n, getNextDivisor, processPrimeFactor) {
  n = SNat.cast(n);
  if (n.isZero()) {
    return;
  }
  var t = n;
  while (true) {
    var d = getNextDivisor(t);
    if (d == null) {
      if (t.ne(1)) {
        processPrimeFactor(t, new SNat(1));
      }
      return;
    }
    var e = new SNat(0);
    while (t.mod(d).isZero()) {
      t = t.div(d);
      e = e.plus(1);
    }
    if (e.isNonZero()) {
      if (!processPrimeFactor(d, e)) {
        return;
      }
    }
  }
}

// Returns a generator that generates 2, then odd numbers up to
// floor(sqrt(n)).
function makeNaiveDivisorGenerator() {
  var next = new SNat(2);
  return function(n) {
    var d = next;
    if (d.times(d).gt(n)) {
      return null;
    }
    next = d.eq(2) ? new SNat(3) : d.plus(2);
    return d;
  };
}
