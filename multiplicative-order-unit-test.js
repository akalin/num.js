'use strict';

describe('multiplicative order', function() {
  beforeEach(function() {
    this.addMatchers({
      toEq: function(expected) {
        return this.actual.eq(expected);
      }
    });
  });

  describe('getMultiplicativeOrderNaive', function() {
    it('small', function() {
      expect(calculateMultiplicativeOrderNaive(4, 7)).toEq(3);
    });

    it('large', function() {
      expect(calculateMultiplicativeOrderNaive(3, 1024)).toEq(256);
    });
  });

  describe('getMultiplicativeOrderPrimePower', function() {
    it('small', function() {
      expect(
        calculateMultiplicativeOrderPrimePower(4, 7, 1)).toEq(3);
    });

    it('large', function() {
      expect(
        calculateMultiplicativeOrderPrimePower(3, 2, 10)).toEq(256);
    });
  });
});
