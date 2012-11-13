'use strict';

describe('Euler phi', function() {
  beforeEach(function() {
    this.addMatchers({
      toEq: function(expected) {
        return this.actual.eq(expected);
      }
    });
  });

  describe('calculateEulerPhiPrimePower', function() {
    it('small', function() {
      expect(calculateEulerPhiPrimePower(2, 7)).toEq(64);
    });

    it('large', function() {
      expect(calculateEulerPhiPrimePower(101, 3)).toEq(1020100);
    });
  });
});
