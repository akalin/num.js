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
});
