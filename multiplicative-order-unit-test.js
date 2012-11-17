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

  describe('getMultiplicativeOrderCRT', function() {
    it('small', function() {
      expect(
        calculateMultiplicativeOrderCRT(4, 7)).toEq(3);
    });

    it('large', function() {
      expect(
        calculateMultiplicativeOrderCRT(3, 1024)).toEq(256);
    });

    it('multiple prime factors', function() {
      expect(
        calculateMultiplicativeOrderCRT(3, 25600)).toEq(1280);
    });
  });

  function appendFactor(p, e) {
    this.push({
      p: p,
      k: e
    });
    return true;
  }

  function factorize(o) {
    var factors = [];
    trialDivide(o, makeMod30WheelDivisorGenerator(),
                appendFactor.bind(factors));
    return factors;
  }

  describe('getMultiplicativeOrderCRTFactors', function() {
    it('small', function() {
      expect(
        calculateMultiplicativeOrderCRTFactors(4, factorize(7))).toEq(3);
    });

    it('large', function() {
      expect(
        calculateMultiplicativeOrderCRTFactors(3, factorize(1024)))
        .toEq(256);
    });

    it('multiple prime factors', function() {
      expect(
        calculateMultiplicativeOrderCRTFactors(3, factorize(25600)))
        .toEq(1280);
    });
  });
});
