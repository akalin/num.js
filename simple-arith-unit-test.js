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

  describe('cast', function() {
    it('from number', function() {
      expect(SNat.cast(31415926535))
        .toHaveArray([5, 3, 5, 6, 2, 9, 5, 1, 4, 1, 3]);
    });

    it('from string', function() {
      expect(SNat.cast('31415926535'))
        .toHaveArray([5, 3, 5, 6, 2, 9, 5, 1, 4, 1, 3]);
    });

    it('from SNat', function() {
      var s = new SNat('31415926535');
      expect(SNat.cast(s)).toEqual(s);
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

    it('min', function() {
      expect(a.min(a)).toEq(a);
      expect(a.min(b)).toEq(b);
      expect(a.min(c)).toEq(c);

      expect(b.min(a)).toEq(b);
      expect(b.min(b)).toEq(b);
      expect(b.min(c)).toEq(b);

      expect(c.min(a)).toEq(c);
      expect(c.min(b)).toEq(b);
      expect(c.min(c)).toEq(c);
    });

    it('max', function() {
      expect(a.max(a)).toEq(a);
      expect(a.max(b)).toEq(a);
      expect(a.max(c)).toEq(a);

      expect(b.max(a)).toEq(a);
      expect(b.max(b)).toEq(b);
      expect(b.max(c)).toEq(c);

      expect(c.max(a)).toEq(a);
      expect(c.max(b)).toEq(c);
      expect(c.max(c)).toEq(c);
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

  describe('pow', function() {
    it('zero', function() {
      var a = new SNat(0);
      expect(a.pow(0)).toHaveString('1');
      expect(a.pow(1)).toHaveString('0');
      expect(a.pow(2)).toHaveString('0');
      expect(a.pow('314159265358979')).toHaveString('0');
    });

    it('one', function() {
      var a = new SNat(1);
      expect(a.pow(0)).toHaveString('1');
      expect(a.pow(1)).toHaveString('1');
      expect(a.pow(2)).toHaveString('1');
      expect(a.pow('314159265358979')).toHaveString('1');
    });

    it('two', function() {
      var a = new SNat(2);
      expect(a.pow(0)).toHaveString('1');
      expect(a.pow(1)).toHaveString('2');
      expect(a.pow(2)).toHaveString('4');
      expect(a.pow(10)).toHaveString('1024');
      expect(a.pow(32)).toHaveString('4294967296');
      expect(a.pow(64)).toHaveString('18446744073709551616');
    });

    it('large', function() {
      var a = new SNat(387420489);
      expect(a.pow(0)).toHaveString('1');
      expect(a.pow(1)).toHaveString('387420489');
      expect(a.pow(2)).toHaveString('150094635296999121');
      expect(a.pow(10))
        .toHaveString('761773480458663923392897277206155617' +
                      '50424801402395196724001565744957137343033038019601');
    });
  });

  describe('powMod', function() {
    it('zero', function() {
      var a = new SNat(0);
      expect(a.powMod(0, 1)).toHaveString('0');
      expect(a.powMod(0, 2)).toHaveString('1');
      expect(a.powMod(0, 100)).toHaveString('1');
      expect(a.powMod(1, 1)).toHaveString('0');
      expect(a.powMod(1, 2)).toHaveString('0');
      expect(a.powMod(1, 100)).toHaveString('0');
      expect(a.powMod(2, 1)).toHaveString('0');
      expect(a.powMod(2, 2)).toHaveString('0');
      expect(a.powMod(2, 100)).toHaveString('0');
      expect(a.powMod('314159265358979', 100)).toHaveString('0');
    });

    it('one', function() {
      var a = new SNat(1);
      expect(a.powMod(0, 1)).toHaveString('0');
      expect(a.powMod(0, 2)).toHaveString('1');
      expect(a.powMod(0, 100)).toHaveString('1');
      expect(a.powMod(1, 1)).toHaveString('0');
      expect(a.powMod(1, 2)).toHaveString('1');
      expect(a.powMod(1, 100)).toHaveString('1');
      expect(a.powMod(2, 1)).toHaveString('0');
      expect(a.powMod(2, 2)).toHaveString('1');
      expect(a.powMod(2, 100)).toHaveString('1');
      expect(a.powMod('314159265358979', 100)).toHaveString('1');
    });

    it('two', function() {
      var a = new SNat(2);
      expect(a.powMod(0, 3)).toHaveString('1');
      expect(a.powMod(1, 3)).toHaveString('2');
      expect(a.powMod(2, 3)).toHaveString('1');
      expect(a.powMod(10, 3)).toHaveString('1');
      expect(a.powMod(10, 5)).toHaveString('4');
      expect(a.powMod(32, 3)).toHaveString('1');
      expect(a.powMod(32, 5)).toHaveString('1');
      expect(a.powMod(64, 3)).toHaveString('1');
      expect(a.powMod(64, 5)).toHaveString('1');
    });

    it('large', function() {
      var a = new SNat(387420489);
      expect(a.powMod(0, 1)).toHaveString('0');
      expect(a.powMod(1, 100)).toHaveString('89');
      expect(a.powMod(2, 53)).toHaveString('46');
      expect(a.powMod(10, 101)).toHaveString('95');
    });
  });

  describe('ln', function() {
    it('zero', function() {
      expect((new SNat(0)).ln()).toEqual(-Infinity);
    });

    it('one', function() {
      expect((new SNat(1)).ln()).toEqual(0);
    });

    var maxUint32 = ~0 >>> 0;

    it('max uint32', function() {
      expect((new SNat(maxUint32)).ln()).toEqual(Math.log(maxUint32));
    });

    it('max uint32 + 1', function() {
      expect((new SNat(maxUint32 + 1)).ln())
        .toEqual(Math.log(maxUint32 + 1));
    });

    var maxIntDouble = Math.pow(2, 53);

    it('max int double', function() {
      expect((new SNat(maxIntDouble)).ln()).toEqual(Math.log(maxIntDouble));
    });

    it('max int double + 1', function() {
      expect((new SNat(maxIntDouble).plus(1)).ln())
        .toBeCloseTo(36.736800569677101510, 15);
    });

    it('googol', function() {
      expect((new SNat(10)).pow(100).ln()).toEqual(230.2585092994046);
    });
  });

  describe('gcd', function() {
    it('zero', function() {
      expect(function() { (new SNat(0)).gcd(1); }).toThrow('gcd with zero');
      expect(function() { (new SNat(1)).gcd(0); }).toThrow('gcd with zero');
    });

    it('one', function() {
      expect((new SNat(1)).gcd(5)).toEq(1);
      expect((new SNat(1)).gcd(100)).toEq(1);
      expect((new SNat(5)).gcd(1)).toEq(1);
      expect((new SNat(100)).gcd(11)).toEq(1);
    });

    it('coprime', function() {
      expect((new SNat(3)).gcd(5)).toEq(1);
      expect((new SNat(5)).gcd(7)).toEq(1);
      expect((new SNat(7)).gcd(1)).toEq(1);
    });

    it('non-trivial gcd', function() {
      expect((new SNat(6)).gcd(9)).toEq(3);
      expect((new SNat(121)).gcd(110)).toEq(11);
    });
  });

  describe('lcm', function() {
    it('zero', function() {
      expect(function() { (new SNat(0)).lcm(1); }).toThrow('gcd with zero');
      expect(function() { (new SNat(1)).lcm(0); }).toThrow('gcd with zero');
    });

    it('one', function() {
      expect((new SNat(1)).lcm(5)).toEq(5);
      expect((new SNat(1)).lcm(100)).toEq(100);
      expect((new SNat(5)).lcm(1)).toEq(5);
      expect((new SNat(100)).lcm(1)).toEq(100);
    });

    it('coprime', function() {
      expect((new SNat(3)).lcm(5)).toEq(15);
      expect((new SNat(5)).lcm(7)).toEq(35);
      expect((new SNat(7)).lcm(11)).toEq(77);
    });

    it('non-trivial lcm', function() {
      expect((new SNat(6)).lcm(9)).toEq(18);
      expect((new SNat(121)).lcm(110)).toEq(1210);
    });
  });

  describe('floorLg', function() {
    it('zero', function() {
      expect((new SNat(0)).floorLg()).toEqual(-Infinity);
    });

    it('one', function() {
      expect((new SNat(1)).floorLg()).toEqual(0);
    });

    it('uint powers of 2', function() {
      for (var i = 1; i < 31; ++i) {
        var n = (1 << i) >>> 0;
        expect((new SNat(n-1)).floorLg()).toEqual(i-1);
        expect((new SNat(n)).floorLg()).toEqual(i);
        expect((new SNat(n+1)).floorLg()).toEqual(i);
      }
    });

    it('large powers of 2', function() {
      for (var i = 32; i < 100; ++i) {
        var n = (new SNat(2)).pow(i);
        expect(n.minus(1).floorLg()).toEqual(i-1);
        expect(n.floorLg()).toEqual(i);
        expect(n.plus(1).floorLg()).toEqual(i);
      }
    });
  });

  describe('ceilLg', function() {
    it('zero', function() {
      expect((new SNat(0)).ceilLg()).toEqual(-Infinity);
    });

    it('one', function() {
      expect((new SNat(1)).ceilLg()).toEqual(0);
    });

    it('uint powers of 2', function() {
      for (var i = 1; i < 31; ++i) {
        var n = (1 << i) >>> 0;
        if (n > 2) {
          expect((new SNat(n-1)).ceilLg()).toEqual(i);
        }
        expect((new SNat(n)).ceilLg()).toEqual(i);
        expect((new SNat(n+1)).ceilLg()).toEqual(i+1);
      }
    });

    it('large powers of 2', function() {
      for (var i = 32; i < 100; ++i) {
        var n = (new SNat(2)).pow(i);
        expect(n.minus(1).ceilLg()).toEqual(i);
        expect(n.ceilLg()).toEqual(i);
        expect(n.plus(1).ceilLg()).toEqual(i+1);
      }
    });
  });

  describe('floorRoot', function() {
    it('sqrt', function() {
      expect((new SNat(0)).floorRoot(2)).toEq(0);

      expect((new SNat(1)).floorRoot(2)).toEq(1);

      expect((new SNat(2)).floorRoot(2)).toEq(1);

      expect((new SNat(3)).floorRoot(2)).toEq(1);
      expect((new SNat(4)).floorRoot(2)).toEq(2);
      expect((new SNat(5)).floorRoot(2)).toEq(2);

      expect((new SNat(8)).floorRoot(2)).toEq(2);
      expect((new SNat(9)).floorRoot(2)).toEq(3);
      expect((new SNat(10)).floorRoot(2)).toEq(3);

      expect((new SNat(15)).floorRoot(2)).toEq(3);
      expect((new SNat(16)).floorRoot(2)).toEq(4);
      expect((new SNat(17)).floorRoot(2)).toEq(4);

      expect((new SNat(24)).floorRoot(2)).toEq(4);
      expect((new SNat(25)).floorRoot(2)).toEq(5);
      expect((new SNat(26)).floorRoot(2)).toEq(5);

      expect((new SNat(35)).floorRoot(2)).toEq(5);
      expect((new SNat(36)).floorRoot(2)).toEq(6);
      expect((new SNat(37)).floorRoot(2)).toEq(6);
    });

    it('cube root', function() {
      expect((new SNat(0)).floorRoot(3)).toEq(0);
      for (var i = 1; i < 7; ++i) {
        expect((new SNat(i)).floorRoot(3)).toEq(1);
      }

      expect((new SNat(7)).floorRoot(3)).toEq(1);
      expect((new SNat(8)).floorRoot(3)).toEq(2);
      expect((new SNat(9)).floorRoot(3)).toEq(2);

      expect((new SNat(26)).floorRoot(3)).toEq(2);
      expect((new SNat(27)).floorRoot(3)).toEq(3);
      expect((new SNat(28)).floorRoot(3)).toEq(3);

      expect((new SNat(63)).floorRoot(3)).toEq(3);
      expect((new SNat(64)).floorRoot(3)).toEq(4);
      expect((new SNat(65)).floorRoot(3)).toEq(4);
    });

    it('fourth root', function() {
      expect((new SNat(0)).floorRoot(4)).toEq(0);
      for (var i = 1; i < 15; ++i) {
        expect((new SNat(i)).floorRoot(4)).toEq(1);
      }

      expect((new SNat(15)).floorRoot(4)).toEq(1);
      expect((new SNat(16)).floorRoot(4)).toEq(2);
      expect((new SNat(17)).floorRoot(4)).toEq(2);

      expect((new SNat(80)).floorRoot(4)).toEq(2);
      expect((new SNat(81)).floorRoot(4)).toEq(3);
      expect((new SNat(82)).floorRoot(4)).toEq(3);

      expect((new SNat(255)).floorRoot(4)).toEq(3);
      expect((new SNat(256)).floorRoot(4)).toEq(4);
      expect((new SNat(257)).floorRoot(4)).toEq(4);
    });

    it('large root', function() {
      var r = 99;
      expect((new SNat(0)).floorRoot(r)).toEq(0);
      var twoPowR = (new SNat(2)).pow(r);
      var threePowR = (new SNat(3)).pow(r);
      var fourPowR = (new SNat(4)).pow(r);

      for (var i = 1; i < 100; ++i) {
        expect((new SNat(i)).floorRoot(r)).toEq(1);
      }

      expect((new SNat(twoPowR.minus(1))).floorRoot(r)).toEq(1);
      expect((new SNat(twoPowR)).floorRoot(r)).toEq(2);
      expect((new SNat(twoPowR.plus(1))).floorRoot(r)).toEq(2);

      expect((new SNat(threePowR.minus(1))).floorRoot(r)).toEq(2);
      expect((new SNat(threePowR)).floorRoot(r)).toEq(3);
      expect((new SNat(threePowR.plus(1))).floorRoot(r)).toEq(3);

      expect((new SNat(fourPowR.minus(1))).floorRoot(r)).toEq(3);
      expect((new SNat(fourPowR)).floorRoot(r)).toEq(4);
      expect((new SNat(fourPowR.plus(1))).floorRoot(r)).toEq(4);
    });
  });

  describe('random', function() {
    function alwaysZero() { return 0.0; }
    function alwaysOneHalf() { return 0.5; }
    function alwaysOneMinusEpsilon() { return 1.0 - 2e-16; }
    function alwaysOne() { return 1.0; }

    var googol = (new SNat(10)).pow(100);

    it('alwaysZero', function() {
      function random(min, max) {
        return SNat.random(min, max, alwaysZero);
      }
      expect(random(1, 100)).toEq('1');
      expect(random(2, 1000)).toEq('2');
      expect(random(3, 10000)).toEq('3');
      expect(random(4, googol)).toEq('4');
    });

    it('alwaysOneHalf', function() {
      function random(min, max) {
        return SNat.random(min, max, alwaysOneHalf);
      }
      expect(random(5, 100)).toEq('52');
      expect(random(6, 1000)).toEq('503');
      expect(random(7, 10000)).toEq('5003');
      var googolLB = googol.div(2);
      var googolUB = googolLB.plus((new SNat(10)).pow(91));
      expect(random(8, googol)).toGt(googolLB);
      expect(random(9, googol)).toLt(googolUB);
    });

    it('alwaysOneMinusEpsilon', function() {
      function random(min, max) {
        return SNat.random(min, max, alwaysOneMinusEpsilon);
      }
      expect(random(10, 100)).toEq('99');
      expect(random(11, 1000)).toEq('999');
      expect(random(12, 10000)).toEq('9999');
      expect(random(13, googol)).toEq(googol.minus(1));
    });

    it('alwaysOne', function() {
      function random(min, max) {
        return SNat.random(min, max, alwaysOne);
      }
      expect(random(14, 100)).toEq('14');
      expect(random(15, 1000)).toEq('15');
      expect(random(16, 10000)).toEq('16');
      expect(random(17, googol)).toEq('17');
    });

    it('default', function() {
      var a = SNat.random(18, 100);
      var b = SNat.random(19, 1000);
      var c = SNat.random(20, 10000);
      var d = SNat.random(21, googol);
      expect(a.ge(18)).toBeTruthy();
      expect(a.lt(100)).toBeTruthy();
      expect(b.ge(19)).toBeTruthy();
      expect(b.lt(1000)).toBeTruthy();
      expect(c.ge(20)).toBeTruthy();
      expect(c.lt(10000)).toBeTruthy();
      expect(d.ge(21)).toBeTruthy();
      expect(d.lt(googol)).toBeTruthy();
    });

    it('error', function() {
      expect(function() { SNat.random(0, 0, alwaysZero) })
        .toThrow('invalid range [0, 0)');
      expect(function() { SNat.random(5, 5, alwaysZero) })
        .toThrow('invalid range [5, 5)');
      expect(function() { SNat.random(10, 5, alwaysZero) })
        .toThrow('invalid range [10, 5)');
    });
  });

  describe('rsa', function() {
    it('mult', function() {
      for (var i in rsa) {
        var f1 = new SNat(rsa[i][0]);
        var f2 = new SNat(rsa[i][1]);
        expect(f1.times(f2)).toEq(rsa[i][2]);
      }
    });

    it('div', function() {
      for (var i in rsa) {
        var s = new SNat(rsa[i][2]);
        expect(s.div(rsa[i][0])).toEq(rsa[i][1]);
        expect(s.div(rsa[i][1])).toEq(rsa[i][0]);
      }
    });
  });
});

describe('SPoly', function() {
  beforeEach(function() {
    this.addMatchers({
      // Returns true iff the actual SPoly's internal representation is
      // elementwise equal to the given expected array.
      toHaveArray: function(expected) {
        var actual = this.actual.a_;
        var l = expected.length;
        if (this.actual.a_.length != l) {
          return false;
        }
        for (var i = 0; i < l; ++i) {
          if (actual[i][0].ne(expected[i][0])) {
            return false;
          }
          if (actual[i][1].ne(expected[i][1])) {
            return false;
          }
        }
        return true;
      },

      // Returns true iff the actual SPoly's string representation is
      // equal to the given expected string.
      toHaveString: function(expected) {
        return this.actual.toString() == expected;
      },

      // Forwarders to SPoly comparison operators.

      toEq: function(expected) {
        return this.actual.eq(expected);
      },

      toNe: function(expected) {
        return this.actual.ne(expected);
      }
    });
  });

  describe('constructor', function() {
    it('degenerate', function() {
      expect(new SPoly()).toHaveArray([]);
      expect(new SPoly(new SNat())).toHaveArray([]);
    });

    it('from SNat', function() {
      var n = new SNat('3141592653589');
      expect(new SPoly(new SNat(5))).toHaveArray([[0, 5]]);
      expect(new SPoly(n)).toHaveArray([[0, n]]);
    });
  });

  describe('degree', function() {
    it('eq', function() {
      var a = new SPoly(new SNat(31415926535));
      expect(new SPoly().degree()).toEqual(-Infinity);
      expect(a.degree()).toEq(0);
      expect(a.shiftLeft(5).degree()).toEq(5);
    });
  });

  describe('comparisons', function() {
    var a = new SPoly(new SNat(31415926535));
    var b = a.shiftLeft(10);
    var c = new SPoly(new SNat(2718281828));

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
  });

  describe('shiftLeft', function() {
    it('basic', function() {
      expect(new SPoly().shiftLeft(100)).toHaveArray([]);
      expect(new SPoly(new SNat(5)).shiftLeft(100)).toHaveArray([[100, 5]]);
    });

    it('no shift', function() {
      expect(new SPoly().shiftLeft(0)).toHaveArray([]);
      expect(new SPoly(new SNat(5)).shiftLeft(0)).toHaveArray([[0, 5]]);
    });
  });

  describe('shiftRight', function() {
    it('basic', function() {
      expect(new SPoly(new SNat(5)).shiftRight(1)).toHaveArray([]);
      expect(new SPoly(new SNat(5)).shiftLeft(100).shiftRight(49))
        .toHaveArray([[51, 5]]);
      expect(new SPoly(new SNat(5)).shiftLeft(100).shiftRight(100))
        .toHaveArray([[0, 5]]);
    });

    it('no shift', function() {
      expect(new SPoly().shiftRight(0)).toHaveArray([]);
      expect(new SPoly(new SNat(5)).shiftRight(0)).toHaveArray([[0, 5]]);
    });
  });

  describe('truncate', function() {
    it('basic', function() {
      var p = new SPoly(new SNat(5)).shiftLeft(100);
      expect(p.truncate(99)).toHaveArray([]);
      expect(p.truncate(100)).toHaveArray([[100, 5]]);
    });

    it('large', function() {
      var d = (new SNat(2)).pow(100);
      var p = new SPoly(new SNat(5)).shiftLeft(d);
      expect(p.truncate(d.minus(1))).toHaveArray([]);
      expect(p.truncate(d)).toHaveArray([[d, 5]]);
    });
  });

  describe('plus', function() {
    var x = new SPoly();
    for (var i = 0; i < 5; ++i) {
      x = x.plus((new SPoly(new SNat(i + 1))).shiftLeft(i));
    }

    it('monomial', function() {
      expect(x).toHaveArray([[0, 1], [1, 2], [2, 3], [3, 4], [4, 5]]);
    });

    it('zero', function() {
      expect(x.plus(new SPoly()))
        .toHaveArray([[0, 1], [1, 2], [2, 3], [3, 4], [4, 5]]);
    });

    it('polynomial', function() {
      expect(x.plus(x.shiftLeft(2)))
        .toHaveArray(
          [[0, 1], [1, 2], [2, 4], [3, 6], [4, 8], [5, 4], [6, 5]]);
    });

    it('staggered', function() {
      var x = new SPoly();
      var y = new SPoly();
      for (var i = 0; i < 5; ++i) {
        x = x.plus((new SPoly(new SNat(2*i+1))).shiftLeft(2*i));
        y = y.plus((new SPoly(new SNat(2*i+2))).shiftLeft(2*i+1));
      }

      expect(x.plus(y))
        .toHaveArray(
          [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7],
           [7, 8], [8, 9], [9, 10]]);
    });
  });

  describe('times', function() {
    it('basic', function() {
      var i = new SNat(1);
      // p = x + 1.
      var p = new SPoly(i).shiftLeft(1).plus(new SPoly(i));

      // p = (x + 1)^2.
      p = p.times(p);
      expect(p).toHaveArray([[0, 1], [1, 2], [2, 1]]);

      // p = (x + 1)^4.
      p = p.times(p);
      expect(p).toHaveArray([[0, 1], [1, 4], [2, 6], [3, 4], [4, 1]]);
    });
  });

  describe('toString', function() {
    it('constant', function() {
      var n = new SNat('3141592653589');
      expect(new SPoly(new SNat(5))).toHaveString('5');
      expect(new SPoly(n)).toHaveString('3141592653589');
    });

    it('x', function() {
      var n = new SNat('3141592653589');
      expect(new SPoly(new SNat(1)).shiftLeft(1)).toHaveString('x');
      expect(new SPoly(n).shiftLeft(1)).toHaveString('3141592653589x');
    });

    it('x^n', function() {
      var i = new SNat(1);
      var n = new SNat('3141592653589');
      expect(new SPoly(i).shiftLeft(2)).toHaveString('x^2');
      expect(new SPoly(i).shiftLeft(100)).toHaveString('x^100');
      expect(new SPoly(n).shiftLeft(2)).toHaveString('3141592653589x^2');
      expect(new SPoly(n).shiftLeft(100)).toHaveString('3141592653589x^100');
    });

    it('polynomial', function() {
      var x = new SPoly();
      for (var i = 0; i < 5; ++i) {
        x = x.plus((new SPoly(new SNat(i + 1))).shiftLeft(i));
      }
      expect(x).toHaveString('5x^4+4x^3+3x^2+2x+1');
    });

    it('degenerate', function() {
      expect(new SPoly()).toHaveString('0');
      expect(new SPoly(new SNat())).toHaveString('0');
    });
  });
});
