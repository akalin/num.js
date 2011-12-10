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
