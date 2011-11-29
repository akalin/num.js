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
      },

      // Forwarders to SNat comparison operators.

      toEq: function(expected) {
        return this.actual.eq(expected);
      },

      toNe: function(expected) {
        return this.actual.ne(expected);
      },

      toLt: function(expected) {
        return this.actual.lt(expected);
      },

      toLe: function(expected) {
        return this.actual.le(expected);
      },

      toGt: function(expected) {
        return this.actual.gt(expected);
      },

      toGe: function(expected) {
        return this.actual.ge(expected);
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

  describe('comparisons', function() {
    var a = new SNat(31415926535);
    var b = new SNat(2718281828);
    var c = new SNat(3141592653);

    it('eq', function() {
      expect(a).toEq(a);
      expect(a).not.toEq(b);
      expect(a).not.toEq(c);

      expect(b).not.toEq(a);
      expect(b).toEq(b);
      expect(b).not.toEq(c);

      expect(c).not.toEq(a);
      expect(c).not.toEq(b);
      expect(c).toEq(c);
    });

    it('ne', function() {
      expect(a).not.toNe(a);
      expect(a).toNe(b);
      expect(a).toNe(c);

      expect(b).toNe(a);
      expect(b).not.toNe(b);
      expect(b).toNe(c);

      expect(c).toNe(a);
      expect(c).toNe(b);
      expect(c).not.toNe(c);
    });

    it('le', function() {
      expect(a).toLe(a);
      expect(a).not.toLe(b);
      expect(a).not.toLe(c);

      expect(b).toLe(a);
      expect(b).toLe(b);
      expect(b).toLe(c);

      expect(c).toLe(a);
      expect(c).not.toLe(b);
      expect(c).toLe(c);
    });

    it('lt', function() {
      expect(a).not.toLt(a);
      expect(a).not.toLt(b);
      expect(a).not.toLt(c);

      expect(b).toLt(a);
      expect(b).not.toLt(b);
      expect(b).toLt(c);

      expect(c).toLt(a);
      expect(c).not.toLt(b);
      expect(c).not.toLt(c);
    });

    it('ge', function() {
      expect(a).toGe(a);
      expect(a).toGe(b);
      expect(a).toGe(c);

      expect(b).not.toGe(a);
      expect(b).toGe(b);
      expect(b).not.toGe(c);

      expect(c).not.toGe(a);
      expect(c).toGe(b);
      expect(c).toGe(c);
    });

    it('gt', function() {
      expect(a).not.toGt(a);
      expect(a).toGt(b);
      expect(a).toGt(c);

      expect(b).not.toGt(a);
      expect(b).not.toGt(b);
      expect(b).not.toGt(c);

      expect(c).not.toGt(a);
      expect(c).toGt(b);
      expect(c).not.toGt(c);
    });

    it('conversions', function() {
      var s = a.toString();
      var n = 314159;
      expect(a).toEq(s);
      expect(a).not.toEq(n);

      expect(a).not.toNe(s);
      expect(a).toNe(n);

      expect(a).toLe(s);
      expect(a).not.toLe(n);

      expect(a).not.toLt(s);
      expect(a).not.toLt(n);

      expect(a).toGe(s);
      expect(a).toGe(n);

      expect(a).not.toGt(s);
      expect(a).toGt(n);
    });

    it('zero', function() {
      var zero = new SNat(0);
      var one = new SNat(1);

      expect(zero.isZero()).toBeTruthy();
      expect(zero.isNonZero()).toBeFalsy();

      expect(one.isZero()).toBeFalsy();
      expect(one.isNonZero()).toBeTruthy();
    });

    it('even/odd', function() {
      for (var i = 0; i < 101; ++i) {
        var n = new SNat(i);
        expect(n.isEven()).toEqual(i % 2 == 0);
        expect(n.isOdd()).toEqual(i % 2 != 0);
      }
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

  describe('minus', function() {
    it('basic', function() {
      expect((new SNat(31415926535)).minus('27182818289'))
        .toHaveString('4233108246');
    });

    it('no zero-padding', function() {
      var a = new SNat(100);
      expect(a.minus(1)).toHaveArray([9, 9]);
      expect(a.minus(100)).toHaveArray([]);
    });

    it('carry', function() {
      expect((new SNat(1000000000)).minus(1)).toHaveString('999999999');
    });

    it('parse error', function() {
      expect(function() { (new SNat('314159')).minus(''); })
        .toThrow('cannot parse ');
    });

    it('degenerate', function() {
      var a = new SNat(99999999999);
      expect(a.minus(0)).toEqual(a);
      expect(a.minus('000')).toEqual(a);
    });

    it('size error', function() {
      expect(function() { (new SNat('10')).minus(11); })
        .toThrow('tried to subtract larger number 11 from 10');
    });
  });

  describe('times', function() {
    it('basic', function() {
      expect((new SNat(31415926535)).times('27182818289'))
        .toHaveString('853973422381478398615');
    });

    it('nines', function() {
      expect((new SNat(9999)).times('9999999999'))
        .toHaveString('99989999990001');
    });

    it('no zero-padding', function() {
      expect((new SNat(100)).times(0)).toHaveArray([]);
    });

    it('carry', function() {
      expect((new SNat(9999)).times(9999)).toHaveString('99980001');
    });

    it('parse error', function() {
      expect(function() { (new SNat('27182')).times(''); })
        .toThrow('cannot parse ');
    });

    it('degenerate', function() {
      var a = new SNat(100);
      expect(a.times(0)).toHaveArray([]);
      expect(a.times('000')).toHaveArray([]);
    });
  });

  describe('div', function() {
    it('basic', function() {
      var a = new SNat('853973422381478398615');
      expect(a.div(27182818289)).toHaveString('31415926535');
      expect(a.div(31415926535)).toHaveString('27182818289');
    });

    it('has remainder', function() {
      var a = new SNat(100);
      expect(a.div(26)).toHaveString('3');
      expect(a.div(3)).toHaveString('33');
    });

    it('nines', function() {
      var a = new SNat('99989999990001');
      expect(a.div(9999)).toHaveString('9999999999');
      expect(a.div(9999999999)).toHaveString('9999');
    });

    it('no zero-padding', function() {
      expect((new SNat(55)).div(6)).toHaveArray([9]);
    });

    it('degenerate', function() {
      expect((new SNat('100')).div(1000)).toHaveArray([]);
    });

    it('division by zero', function() {
      expect(function() { (new SNat('100')).div('0'); })
        .toThrow('division by zero');
    });
  });

  describe('mod', function() {
    it('basic', function() {
      var a = new SNat(100);
      expect(a.mod(26)).toHaveString('22');
      expect(a.mod(3)).toHaveString('1');
    });

    it('no remainder', function() {
      var a = new SNat('853973422381478398615');
      expect(a.mod(27182818289)).toHaveString('0');
      expect(a.mod(31415926535)).toHaveString('0');
    });

    it('no zero-padding', function() {
      expect((new SNat(100)).mod(3)).toHaveArray([1]);
    });

    it('degenerate', function() {
      expect((new SNat('100')).mod(1000)).toHaveString('100');
    });

    it('division by zero', function() {
      expect(function() { (new SNat('100')).mod('0'); })
        .toThrow('division by zero');
    });
  });
});