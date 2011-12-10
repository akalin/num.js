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
