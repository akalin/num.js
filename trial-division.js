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
  function checkShouldContinue(shouldContinue) {
    if (shouldContinue !== true && shouldContinue !== false) {
      throw new Error('processPrimeFactor must return true or false');
    }
  }

  n = SNat.cast(n);
  if (n.isZero()) {
    return;
  }
  var t = n;
  while (true) {
    var d = getNextDivisor(t);
    if (d == null) {
      if (t.ne(1)) {
        var shouldContinue = processPrimeFactor(t, new SNat(1));
        checkShouldContinue(shouldContinue);
      }
      return;
    }
    var e = new SNat(0);
    while (t.mod(d).isZero()) {
      t = t.div(d);
      e = e.plus(1);
    }
    if (e.isNonZero()) {
      var shouldContinue = processPrimeFactor(d, e);
      checkShouldContinue(shouldContinue);
      if (!shouldContinue) {
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

// Returns a generator that generates primes up to 7, then odd numbers
// up to floor(sqrt(n)), using a mod-30 wheel to eliminate odd numbers
// that are known composite (roughly half).
function makeMod30WheelDivisorGenerator() {
  var start = [2, 3, 5, 7].map(SNat.cast);
  var si = 1;
  var sl = start.length;
  var wheel = [4, 2, 4, 2, 4, 6, 2, 6];
  var wi = 0;
  var wl = wheel.length;
  var next = start[0];
  return function(n) {
    var d = next;
    if (d.times(d).gt(n)) {
      return null;
    }
    if (si < sl) {
      next = start[si];
      ++si;
    } else {
      next = next.plus(wheel[wi]);
      wi = (wi + 1) % wl;
    }
    return d;
  };
}

// Provide a useful default factorizer.
function defaultFactorizer(n, processPrimeFactor) {
  trialDivide(n, makeMod30WheelDivisorGenerator(), processPrimeFactor);
};
