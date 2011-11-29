'use strict';

describe('SNat', function() {
  beforeEach(function() {
    this.addMatchers({
      // Returns true iff the actual SNat's internal representation is
      // elementwise equal to the given expected array.
      toHaveArray: function(expected) {
        var actual = this.actual.a_;
        var l = expected.length;
        if (this.actual.a_.length != l) {
          return false;
        }
        for (var i = 0; i < l; ++i) {
          if (actual[i] != expected[i]) {
            return false;
          }
        }
        return true;
      },

      // Returns true iff the actual SNat's string representation is
      // equal to the given expected string.
      toHaveString: function(expected) {
        return this.actual.toString() == expected;
      }
    });
  });

  describe('constructor', function() {
    it('from number', function() {
      expect(new SNat(31415926535))
        .toHaveArray([5, 3, 5, 6, 2, 9, 5, 1, 4, 1, 3]);
    });

    it('from string', function() {
      expect(new SNat('31415926535'))
        .toHaveArray([5, 3, 5, 6, 2, 9, 5, 1, 4, 1, 3]);
    });

    it('from SNat', function() {
      expect(new SNat(new SNat('31415926535')))
        .toHaveArray([5, 3, 5, 6, 2, 9, 5, 1, 4, 1, 3]);
    });

    it('parse error', function() {
      expect(function() { new SNat('314159error'); })
        .toThrow('cannot parse 314159error');
      expect(function() { new SNat(''); })
        .toThrow('cannot parse ');
      expect(function() { new SNat({}); })
        .toThrow('cannot parse ' + {}.toString());
    });

    it('degenerate', function() {
      expect(new SNat()).toHaveArray([]);
      expect(new SNat('0')).toHaveArray([]);
      expect(new SNat('00')).toHaveArray([]);
      expect(new SNat('000')).toHaveArray([]);
    });

    it('zero-padded', function() {
      expect(new SNat('000271828182800'))
        .toHaveArray([0, 0, 8, 2, 8, 1, 8, 2, 8, 1, 7, 2]);
    });
  });

  describe('toString', function() {
    it('basic', function() {
      expect(new SNat(31415926535)).toHaveString('31415926535');
    });

    it('degenerate', function() {
      expect(new SNat()).toHaveString('0');
      expect(new SNat('0')).toHaveString('0');
      expect(new SNat('00')).toHaveString('0');
      expect(new SNat('000')).toHaveString('0');
    });

    it('zero-padded', function() {
      expect(new SNat('000271828182800')).toHaveString('271828182800');
    });
  });

  describe('plus', function() {
    it('basic', function() {
      expect((new SNat(31415926535)).plus('27182818289'))
        .toHaveString('58598744824');
    });

    it('no zero-padding', function() {
      expect((new SNat(98)).plus(1)).toHaveArray([9, 9]);
    });

    it('carry', function() {
      expect((new SNat(99999999999)).plus(1)).toHaveString('100000000000');
    });

    it('parse error', function() {
      expect(function() { (new SNat('314159')).plus(''); })
        .toThrow('cannot parse ');
    });

    it('degenerate', function() {
      var a = new SNat(99999999999);
      expect(a.plus(0)).toEqual(a);
      expect(a.plus('000')).toEqual(a);
    });
  });
});
