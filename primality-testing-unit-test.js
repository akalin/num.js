'use strict';

describe('primality testing', function() {
  beforeEach(function() {
    this.addMatchers({
      toEq: function(expected) {
        return this.actual.eq(expected);
      },

      toGt: function(expected) {
        return this.actual.gt(expected);
      }
    });
  });

  describe('testCompositenessByFermat', function() {
    // Returns the list of a such that 1 < a < n and a is not a Fermat
    // witness to n (in ascending order).
    function getNonWitnesses(n) {
      var nonWitnesses = [];
      for (var a = 2; a < n; ++a) {
        if (!hasFermatWitness(n, a)) {
          nonWitnesses.push(a);
        }
      }
      return nonWitnesses;
    }

    // Returns the list of a such that 1 < a < n, a is comprime to n,
    // and a is a Fermat witness to n (in ascending order).
    function getCoprimeWitnesses(n) {
      var coprimeWitnesses = [];
      var nSNat = new SNat(n);
      for (var a = 2; a < n; ++a) {
        if (nSNat.gcd(a).gt(1)) {
          continue;
        }
        if (hasFermatWitness(n, a)) {
          coprimeWitnesses.push(a);
        }
      }
      return coprimeWitnesses;
    }

    it('odd composite numbers', function() {
      expect(getNonWitnesses(9)).toEqual([8]);
      expect(getNonWitnesses(15)).toEqual([4, 11, 14]);
      expect(getNonWitnesses(21)).toEqual([8, 13, 20]);
      expect(getNonWitnesses(25)).toEqual([7, 18, 24]);
    });

    it('even numbers', function() {
      // For even n, all a such that 1 < a < n are Fermat witnesses
      // for n.
      for (var n = 2; n < 28; n += 2) {
        expect(getNonWitnesses(n)).toEqual([]);
      }
      // However, 9 and 25 are Fermat liars for 28.
      expect(getNonWitnesses(28)).toEqual([9, 25]);
    });

    it('Carmichael numbers', function() {
      expect(getCoprimeWitnesses(561)).toEqual([]);
      expect(getCoprimeWitnesses(1105)).toEqual([]);
    });
  });

  describe('testCompositenessbyArtjuhov', function() {
    it('s = 0, r = 1', function() {
      var result = testCompositenessByArtjuhov(28, 9);
      expect(result.s.isZero()).toBeTruthy();
      expect(result.r.eq(1)).toBeTruthy();
      expect(result.isCompositeByArtjuhov).toBeFalsy();
    });

    it('s = 0, r != 1', function() {
      var result = testCompositenessByArtjuhov(4, 3);
      expect(result.s.isZero()).toBeTruthy();
      expect(result.r.eq(1)).toBeFalsy();
      expect(result.isCompositeByArtjuhov).toBeTruthy();
    });

    it('i = 0, r = 0', function() {
      var result = testCompositenessByArtjuhov(25, 5);
      expect(result.i.isZero()).toBeTruthy();
      expect(result.r.isZero()).toBeTruthy();
      expect(result.isCompositeByArtjuhov).toBeTruthy();
    });

    it('i = 0, r = -1', function() {
      var result = testCompositenessByArtjuhov(11, 2);
      expect(result.i.isZero()).toBeTruthy();
      expect(result.r.eq(10)).toBeTruthy();
      expect(result.isCompositeByArtjuhov).toBeFalsy();
    });

    it('i = 0, r = +1', function() {
      var result = testCompositenessByArtjuhov(7, 2);
      expect(result.i.isZero()).toBeTruthy();
      expect(result.r.eq(1)).toBeTruthy();
      expect(result.isCompositeByArtjuhov).toBeFalsy();
    });

    it('0 < i < s, r = 0', function() {
      var result = testCompositenessByArtjuhov(9, 3);
      expect(result.i.gt(0)).toBeTruthy();
      expect(result.i.lt(result.s)).toBeTruthy();
      expect(result.r.isZero()).toBeTruthy();
      expect(result.isCompositeByArtjuhov).toBeTruthy();
    });

    it('0 < i < s, r = -1', function() {
      var result = testCompositenessByArtjuhov(5, 2);
      expect(result.i.gt(0)).toBeTruthy();
      expect(result.i.lt(result.s)).toBeTruthy();
      expect(result.r.eq(4)).toBeTruthy();
      expect(result.isCompositeByArtjuhov).toBeFalsy();
    });

    it('0 < i < s, r = +1', function() {
      var result = testCompositenessByArtjuhov(21, 8);
      expect(result.i.gt(0)).toBeTruthy();
      expect(result.i.lt(result.s)).toBeTruthy();
      expect(result.r.eq(1)).toBeTruthy();
      expect(result.isCompositeByArtjuhov).toBeTruthy();
    });

    it('i = s, r = 1', function() {
      var result = testCompositenessByArtjuhov(15, 4);
      expect(result.i.eq(result.s)).toBeTruthy();
      expect(result.r.eq(1)).toBeTruthy();
      expect(result.isCompositeByArtjuhov).toBeTruthy();
    });

    it('i = s, r != 1', function() {
      var result = testCompositenessByArtjuhov(9, 2);
      expect(result.i.eq(result.s)).toBeTruthy();
      expect(result.r.ne(1)).toBeTruthy();
      expect(result.isCompositeByArtjuhov).toBeTruthy();
    });

    it('Carmichael numbers', function() {
      expect(hasArtjuhovWitness(561, 2)).toBeTruthy();
      expect(hasArtjuhovWitness(561, 3)).toBeTruthy();
      expect(hasArtjuhovWitness(561, 5)).toBeTruthy();
      expect(hasArtjuhovWitness(561, 7)).toBeTruthy();
      expect(hasArtjuhovWitness(561, 11)).toBeTruthy();
      expect(hasArtjuhovWitness(561, 13)).toBeTruthy();
      expect(hasArtjuhovWitness(561, 17)).toBeTruthy();

      expect(hasArtjuhovWitness(1105, 2)).toBeTruthy();
      expect(hasArtjuhovWitness(1105, 3)).toBeTruthy();
      expect(hasArtjuhovWitness(1105, 5)).toBeTruthy();
      expect(hasArtjuhovWitness(1105, 7)).toBeTruthy();
      expect(hasArtjuhovWitness(1105, 11)).toBeTruthy();
      expect(hasArtjuhovWitness(1105, 13)).toBeTruthy();
      expect(hasArtjuhovWitness(1105, 17)).toBeTruthy();
    });
  });

  describe('isProbablePrime', function() {
    it('small primes', function() {
      expect(smallPrimes.filter(function(n) { return isProbablePrime(n); }))
        .toEqual(smallPrimes);
    });
  });

  describe('getArtjuhovWitnessBound', function() {
    it('small', function() {
      expect(getArtjuhovWitnessBound(2)).toEq(0);
      expect(getArtjuhovWitnessBound(3)).toEq(1);
      expect(getArtjuhovWitnessBound(4)).toEq(2);
      expect(getArtjuhovWitnessBound(5)).toEq(3);
    });
  });

  describe('isPrimeByMiller', function() {
    var smallOddPrimesGt5 = smallPrimes.slice(2);
    it('small primes', function() {
      expect(smallOddPrimesGt5.filter(isPrimeByMiller)).
        toEqual(smallOddPrimesGt5);
    });
  });

  describe('AKS', function() {
    describe('calculateAKSModulus', function() {
      it('small', function() {
        expect(calculateAKSModulus(1)).toEq(2);
        expect(calculateAKSModulus(2)).toEq(3);
        expect(calculateAKSModulus(3)).toEq(7);
        expect(calculateAKSModulus(4)).toEq(11);
        expect(calculateAKSModulus(5)).toEq(17);
      });

      it('powers of 2', function() {
        var ks = [ 5, 10, 15 ];
        for (var i = 0; i < ks.length; ++i) {
          var k = new SNat(ks[i]);
          var n = (new SNat(2)).pow(k);
          var r = calculateAKSModulus(n);
          var o = calculateMultiplicativeOrderCRT(n, r);
          expect(o).toGt(k.pow(2));
        }
      });
    });
  });
});
