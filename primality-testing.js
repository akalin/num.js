'use strict';

// Runs the Fermat compositeness test given n > 2 and 1 < a < n.
// Calculates r = a^{n-1} mod n and whether a is a Fermat witness to n
// (i.e., r != 1, which means n is composite).  Returns a dictionary
// with a, n, r, and isCompositeByFermat, which is true iff a is a
// Fermat witness to n.
function testCompositenessByFermat(n, a) {
  n = SNat.cast(n);
  a = SNat.cast(a);

  if (n.le(2)) {
    throw new RangeError('n must be > 2');
  }

  if (a.le(1) || a.ge(n)) {
    throw new RangeError('a must satisfy 1 < a < n');
  }

  var r = a.powMod(n.minus(1), n);
  var isCompositeByFermat = r.ne(1);
  return {
    a: a,
    n: n,
    r: r,
    isCompositeByFermat: isCompositeByFermat
  };
}

// Returns true iff a is a Fermat witness to n, and thus n is
// composite.  a and n must satisfy the same conditions as in
// testCompositenessByFermat.
function hasFermatWitness(n, a) {
  return testCompositenessByFermat(n, a).isCompositeByFermat;
}

// Runs the Artjuhov compositeness test given n > 2 and 1 < a < n-1.
// Finds the largest s such that n-1 = t*2^s, calculates r = a^t mod
// n, then repeatedly squares r (mod n) up to s times until r is
// congruent to -1, 0, or 1 (mod n).  Then, based on the value of s
// and the final value of r and i (the number of squarings),
// determines whether a is an Artjuhov witness to n (i.e., n is
// composite).
//
// Returns a dictionary with, a, n, s, t, i, r, rSqrt = sqrt(r) if i >
// 0 and null otherwise, and isCompositeByArtjuhov, which is true iff
// a is an Artjuhov witness to n.
function testCompositenessByArtjuhov(n, a) {
  n = SNat.cast(n);
  a = SNat.cast(a);

  if (n.le(2)) {
    throw new RangeError('n must be > 2');
  }

  if (a.le(1) || a.ge(n)) {
    throw new RangeError('a must satisfy 1 < a < n');
  }

  var nMinusOne = n.minus(1);

  // Find the largest s and t such that n-1 = t*2^s.
  var t = nMinusOne;
  var s = new SNat(0);
  while (t.isEven()) {
    t = t.div(2);
    s = s.plus(1);
  }

  // Find the smallest 0 <= i < s such that a^{t*2^i} = 0/-1/+1 (mod
  // n).
  var i = new SNat(0);
  var rSqrt = null;
  var r = a.powMod(t, n);
  while (i.lt(s) && r.gt(1) && r.lt(nMinusOne)) {
    i = i.plus(1);
    rSqrt = r;
    r = r.times(r).mod(n);
  }

  var isCompositeByArtjuhov = false;
  if (s.isZero()) {
    // If 0 = i = s, then this reduces to the Fermat primality test.
    isCompositeByArtjuhov = r.ne(1);
  } else if (i.isZero()) {
    // If 0 = i < s, then:
    //
    //   * r = 0    (mod n) -> a^{n-1} = 0 (mod n), and
    //   * r = +/-1 (mod n) -> a^{n-1} = 1 (mod n).
    isCompositeByArtjuhov = r.isZero();
  } else if (i.lt(s)) {
    // If 0 < i < s, then:
    //
    //   * r =  0 (mod n) -> a^{n-1} = 0 (mod n),
    //   * r = +1 (mod n) -> a^{t*2^{i-1}} is a non-trivial square root of
    //                       unity mod n, and
    //   * r = -1 (mod n) -> a^{n-1} = 1 (mod n).
    //
    // Note that the last case means r = n - 1 > 1.
    isCompositeByArtjuhov = r.le(1);
  } else {
    // If 0 < i = s, then:
    //
    //   * r =  0 (mod n) can't happen,
    //   * r = +1 (mod n) -> a^{t*2^{i-1}} is a non-trivial square root of
    //                       unity mod n, and
    //   * r > +1 (mod n) -> failure of the Fermat primality test.
    isCompositeByArtjuhov = true;
  }

  return {
    a: a,
    n: n,
    t: t,
    s: s,
    i: i,
    r: r,
    rSqrt: rSqrt,
    isCompositeByArtjuhov: isCompositeByArtjuhov
  };
}

// Returns true iff a is an Arjuhov witness to n, and thus n is
// composite.  a and n must satisfy the same conditions as in
// testCompositenessByArtjuhov.
function hasArtjuhovWitness(n, a) {
  return testCompositenessByArtjuhov(n, a).isCompositeByArtjuhov;
}

// Returns true if n is probably prime, based on sampling the given
// number of possible witnesses and testing them against n.  If false
// is returned, then n is definitely composite.
//
// By default, uses the Artjuhov test for witnesses with 20 samples
// and Math.random for the random number generator.  This gives an
// error bound of 4^-20 if true is returned.
function isProbablePrime(n, hasWitness, numSamples, rng) {
  n = SNat.cast(n);
  hasWitness = hasWitness || hasArtjuhovWitness;
  rng = rng || Math.random;
  numSamples = numSamples || 20;

  if (n.le(1)) {
    return false;
  }

  if (n.le(3)) {
    return true;
  }

  if (n.isEven()) {
    return false;
  }

  for (var i = 0; i < numSamples; ++i) {
    var a = SNat.random(2, n.minus(2), rng);
    if (hasWitness(n, a)) {
      return false;
    }
  }

  return true;
}

// Returns w such that the least Artjuhov witness of n, if it exists,
// is in the interval [2, w].
function getArtjuhovWitnessBound(n) {
  n = SNat.cast(n);

  // We want to calculate w = floor(2 ln^2 n).  Let il and fl be the
  // integer and fractional parts of ln n (respectively).  Then
  //
  //   2 ln^2 n = 2 (il + fl)^2 = 2 il^2 + 4 il fl + 2 fl^2.
  //
  // 2 il^2 is an integer, so we can simply add on the integer part of
  // t = 4 il fl + 2 fl^2 to get w.
  var l = n.ln();
  var il = Math.floor(l);
  var fl = l - il;
  var t = 4*il*fl + 2*fl*fl;
  var w = new SNat(il).pow(2).times(2).plus(Math.floor(t));
  if (w.gt(n.minus(2))) {
    w = n.minus(2);
  }
  return w;
}

var potentialArtjuhovWitnesses = [
  ['4', []],
  ['1373653', [2, 3]],
  ['9080191', [31, 73]],
  ['4759123141', [2, 7, 61]],
  ['2152302898747', [2, 3, 5, 7, 11]],
  ['3474749660383', [2, 3, 5, 7, 11, 13]],
  ['341550071728321', [2, 3, 5, 7, 11, 13, 17]],
];

function getFirstArtjuhovWitness(n) {
  n = SNat.cast(n);

  for (var i = 0; i < potentialArtjuhovWitnesses.length; ++i) {
    if (n.lt(potentialArtjuhovWitnesses[i][0])) {
      var potentialWitnesses = potentialArtjuhovWitnesses[i][1];
      for (var j = 0; j < potentialWitnesses.length; ++j) {
        var potentialWitness = potentialWitnesses[j];
        if (hasArtjuhovWitness(n, potentialWitness)) {
          return potentialWitness;
        }
      }
      return null;
    }
  }

  var w = getArtjuhovWitnessBound(n);
  for (var a = new SNat(2); a.le(w); a = a.plus(1)) {
    if (hasArtjuhovWitness(n, a)) {
      return a;
    }
  }

  return null;
}

function isPrimeByMiller(n) {
  return (getFirstArtjuhovWitness(n) == null);
}

// Returns a probable b-bit prime that is at least 2^b.  All
// parameters but b are passed to isProbablePrime.
function findProbablePrime(b, hasWitness, rng, numSamples) {
  b = SNat.cast(b);

  var lb = (new SNat(2)).pow(b.minus(1));
  var ub = lb.times(2);
  while (true) {
    var n = SNat.random(lb, ub);
    if (isProbablePrime(n, hasWitness, rng, numSamples)) {
      return n;
    }
  }
}

// Returns the least r such that o_r(n) > ceil(lg(n))^2 >= ceil(lg(n)^2).
function calculateAKSModulus(n, multiplicativeOrderCalculator) {
  n = SNat.cast(n);
  multiplicativeOrderCalculator =
    multiplicativeOrderCalculator || calculateMultiplicativeOrderCRT;

  var ceilLgN = new SNat(n.ceilLg());
  var ceilLgNSq = ceilLgN.pow(2);
  var rLowerBound = ceilLgNSq.plus(2);
  var rUpperBound = ceilLgN.pow(5).max(3);

  for (var r = rLowerBound; r.le(rUpperBound); r = r.plus(1)) {
    if (n.gcd(r).ne(1)) {
      continue;
    }
    var o = multiplicativeOrderCalculator(n, r);
    if (o.gt(ceilLgNSq)) {
      return r;
    }
  }

  throw new Error('Could not find AKS modulus');
}

// Returns floor(sqrt(r-1)) * ceil(lg(n)) + 1 > floor(sqrt(Phi(r))) * lg(n).
function calculateAKSUpperBoundSimple(n, r) {
  n = SNat.cast(n);
  r = SNat.cast(r);

  // Use r - 1 instead of calculating Phi(r).
  return r.minus(1).floorRoot(2).times(n.ceilLg()).plus(1);
}
