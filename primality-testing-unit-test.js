'use strict';

describe('primality testing', function() {
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
});
