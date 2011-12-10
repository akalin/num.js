'use strict';

function ArtjuhovViewModel() {
  this.nStr = ko.observable('561');
  this.aStr = ko.observable('2');

  this.n_ = ko.computed(function() {
    return SNat.tryCast(this.nStr());
  }, this);

  this.a_ = ko.computed(function() {
    return SNat.tryCast(this.aStr());
  }, this);

  this.error_ = ko.computed(function() {
    if (this.n_() === null) {
      return 'error.invalidN';
    }
    if (this.a_() === null) {
      return 'error.invalidA';
    }
    if (this.n_().le(2)) {
      return 'error.outOfBoundsN';
    }
    if (this.a_().le(1) || this.a_().ge(this.n_())) {
      return 'error.outOfBoundsA';
    }
    return null;
  }, this);

  this.result_ = ko.computed(function() {
    if (this.error_()) {
      return null;
    }
    return testCompositenessByArtjuhov(this.n_(), this.a_());
  }, this);

  this.t_ = ko.computed(function() {
    if (this.result_() === null) {
      return null;
    }
    return this.result_().t;
  }, this);

  this.s_ = ko.computed(function() {
    if (this.result_() === null) {
      return null;
    }
    return this.result_().s;
  }, this);

  this.i_ = ko.computed(function() {
    if (this.result_() === null) {
      return null;
    }
    return this.result_().i;
  }, this);

  this.r = ko.computed(function() {
    if (this.result_() === null) {
      return null;
    }
    return this.result_().r;
  }, this);

  this.rSqrt = ko.computed(function() {
    if (this.result_() === null) {
      return null;
    }
    return this.result_().rSqrt;
  }, this);

  this.isCompositeByArtjuhov = ko.computed(function() {
    if (this.result_() === null) {
      return null;
    }
    return this.result_().isCompositeByArtjuhov;
  }, this);

  this.factorsHtml = ko.computed(function() {
    var n = this.n_();
    var a = this.a_();
    var i = this.i_();
    var r = this.r();
    if (n === null || a === null || i === null ||
        r === null || !this.isCompositeByArtjuhov()) {
      return null;
    }
    var str = '';
    if (i.isZero() || r.ne(1)) {
      if (r.isZero()) {
        str =
          'Furthermore, gcd(<var>a</var>, <var>n</var>) = ' +
          n.gcd(a) +
          ' is a non-trivial factor of <var>n</var>.';
      }
    } else {
      var rSqrt = this.rSqrt();
      if (rSqrt) {
        str =
          'Furthermore, gcd(&radic;<var>r</var> &minus; 1, <var>n</var>) = ' +
          n.gcd(rSqrt.minus(1)) +
          ' and gcd(&radic;<var>r</var> + 1, <var>n</var>) = ' +
          n.gcd(rSqrt.plus(1)) +
          ' are non-trivial factors of <var>n</var>.';
      }
    }
    return str;
  }, this);

  this.nMinusOneHtml = ko.computed(function() {
    var t = this.t_();
    var s = this.s_();
    if (t === null || s === null || t.isZero() || s.isZero()) {
      return null;
    }
    var str = '';
    if (t.gt(1)) {
      str += t + ' &sdot; ';
    }
    str += '2';
    if (s.gt(1)) {
      str += '<sup>' + s + '</sup>';
    }
    return str;
  }, this);

  this.rHtml = ko.computed(function() {
    var t = this.t_();
    var i = this.i_();
    if (t === null || i === null || t.isZero()) {
      return null;
    }
    var str = '<var>a</var>';
    if (t.gt(1) || i.isNonZero()) {
      str += '<sup>';
      if (t.gt(1)) {
        str += t;
      }
      if (t.gt(1) && i.isNonZero()) {
        str += ' &sdot; ';
      }
      if (i.isNonZero()) {
        str += '2';
        if (i.gt(1)) {
          str += '<sup>' + i + '</sup>';
        }
      }
      str += '</sup>';
    }
    return str;
  }, this);

  this.rResultHtml = ko.computed(function() {
    var n = this.n_();
    var r = this.r();
    if (r === null || n === null) {
      return null;
    }
    var str = r;
    if (r.plus(1).eq(n)) {
      str += ' &equiv; &minus;1';
    }
    return str;
  }, this);

  this.aNMinusOneHtml = ko.computed(function() {
    var n = this.n_();
    var s = this.s_();
    var i = this.i_();
    var r = this.r();
    if (n === null || s === null || i === null || r === null || s.lt(i)) {
      return null;
    }
    if (i.eq(s)) {
      return '<var>r</var> &equiv; ' + r;
    }
    var sMinusI = s.minus(i);
    var str = '<var>r</var><sup>2';
    if (sMinusI.gt(1)) {
      str += '<sup>' + sMinusI + '</sup>';
    }
    str += '</sup> &equiv; ' + r.times(r).mod(n);
    return str;
  }, this);

  this.rSqrtHtml = ko.computed(function() {
    var t = this.t_();
    var i = this.i_();
    if (t === null || i === null || t.isZero() || i.isZero()) {
      return null;
    }
    var iMinusOne = i.minus(1);
    var str = '<var>a</var>';
    if (t.gt(1) || i.gt(1)) {
      str += '<sup>';
      if (t.gt(1)) {
        str += t;
      }
      if (t.gt(1) && iMinusOne.isNonZero()) {
        str += ' &sdot; ';
      }
      if (iMinusOne.isNonZero()) {
        str += '2';
        if (iMinusOne.gt(1)) {
          str += '<sup>' + iMinusOne + '</sup>';
        }
      }
      str += '</sup>';
    }
    return str;
  }, this);

  this.outputTemplate = ko.computed(function() {
    var error = this.error_();
    if (error) {
      return 'artjuhov.' + error;
    }

    if (this.s_().isZero()) {
      return 'artjuhov.success.fermatEquivResult';
    }

    if (this.i_().isZero() || this.r().ne(1)) {
      return 'artjuhov.success.impliesFinalEquivResult';
    }

    return 'artjuhov.success.nonTrivialSqrtResult';
  }, this);
}

ko.applyBindings(new ArtjuhovViewModel(),
                 document.getElementById('artjuhovExample'));
