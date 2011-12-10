'use strict';

function FermatViewModel() {
  this.nStr = ko.observable('355207');
  this.aStr = ko.observable('2');

  this.n = ko.computed(function() {
    return SNat.tryCast(this.nStr());
  }, this);

  this.a = ko.computed(function() {
    return SNat.tryCast(this.aStr());
  }, this);

  this.outputTemplate = ko.computed(function() {
    if (this.n() === null) {
      return 'fermat.error.invalidN';
    }
    if (this.a() === null) {
      return 'fermat.error.invalidA';
    }
    if (this.n().le(2)) {
      return 'fermat.error.outOfBoundsN';
    }
    if (this.a().le(1) || this.a().ge(this.n())) {
      return 'fermat.error.outOfBoundsA';
    }
    return 'fermat.success';
  }, this);

  this.result_ = ko.computed(function() {
    if (this.outputTemplate() != 'fermat.success') {
      return null;
    }
    return testCompositenessByFermat(this.n(), this.a());
  }, this);

  this.r = ko.computed(function() {
    if (this.result_() === null) {
      return null;
    }
    return this.result_().r;
  }, this);

  this.isCompositeByFermat = ko.computed(function() {
    if (this.result_() === null) {
      return null;
    }
    return this.result_().isCompositeByFermat;
  }, this);

  this.k = ko.computed(function() {
    if (!this.isCompositeByFermat()) {
      return null;
    }
    return this.n().gcd(this.a());
  }, this);
}

ko.applyBindings(new FermatViewModel(),
                 document.getElementById('fermatExample'));
