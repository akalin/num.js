'use strict';

describe('trial division', function() {
  beforeEach(function() {
    this.addMatchers({
      toEqFactorList: function(expected) {
        var l = expected.length;
        if (this.actual.length != l) {
          return false;
        }
        for (var i = 0; i < l; ++i) {
          var p = this.actual[i][0];
          var e = this.actual[i][1]
          var expectedP = expected[i][0];
          var expectedE = expected[i][1];
          if (p.ne(expectedP) || e.ne(expectedE)) {
            return false;
          }
        }
        return true;
      }
    });
  });

  function appendFactor(p, e) {
    this.push([p, e]);
    return true;
  }

  describe('naive', function() {
    function factorize(n) {
      var factors = [];
      trialDivide(n, makeNaiveDivisorGenerator(),
                  appendFactor.bind(factors));
      return factors;
    }

    it('trivial', function() {
      expect(factorize(0)).toEqFactorList([]);
      expect(factorize(1)).toEqFactorList([]);
    });

    it('small', function() {
      expect(factorize(2)).toEqFactorList([[2, 1]]);
      expect(factorize(3)).toEqFactorList([[3, 1]]);
      expect(factorize(4)).toEqFactorList([[2, 2]]);
      expect(factorize(5)).toEqFactorList([[5, 1]]);
    });

    it('primes', function() {
      expect(factorize(1009)).toEqFactorList([[1009, 1]]);
      expect(factorize(100003)).toEqFactorList([[100003, 1]]);
      expect(factorize(10000019)).toEqFactorList([[10000019, 1]]);
    });

    it('semi-primes', function() {
      expect(factorize(80137)).toEqFactorList([[127, 1], [631, 1]]);
      expect(factorize(1979447)).toEqFactorList([[631, 1], [3137, 1]]);
    });

    it('powers', function() {
      expect(factorize(8)).toEqFactorList([[2, 3]]);
      expect(factorize(243)).toEqFactorList([[3, 5]]);
    });
  });
});
