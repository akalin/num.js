'use strict';

function AKSViewModel() {
  this.nStr = ko.observable('175507');

  this.n = ko.computed(function() {
    return SNat.tryCast(this.nStr());
  }, this);

  this.floorSqrtN = ko.computed(function() {
    if (this.n() === null) {
      return null;
    }
    return this.n().floorRoot(2);
  }, this);

  this.ceilLgN = ko.computed(function() {
    if (this.n() === null) {
      return null;
    }
    return new SNat(this.n().ceilLg());
  }, this);

  this.ceilLgNSq = ko.computed(function() {
    if (this.ceilLgN() === null) {
      return null;
    }
    return this.ceilLgN().pow(2);
  }, this);

  this.parameters = ko.computed(function() {
    if (this.n() === null) {
      return null;
    }
    return getAKSParametersSimple(this.n());
  }, this);

  this.r = ko.computed(function() {
    if (this.parameters() === null) {
      return null;
    }
    return this.parameters().r;
  }, this);

  this.eulerPhiR = ko.computed(function() {
    if (this.r() === null) {
      return null;
    }
    return calculateEulerPhi(this.r());
  }, this);

  this.nOrder = ko.computed(function() {
    if (this.n() === null || this.r() === null) {
      return null;
    }
    return calculateMultiplicativeOrderCRT(this.n(), this.r());
  }, this);

  this.M = ko.computed(function() {
    if (this.parameters() === null) {
      return null;
    }
    return this.parameters().M;
  }, this);

  this.factor = ko.computed(function() {
    if (this.parameters() === null) {
      return null;
    }
    return this.parameters().factor || null;
  }, this);

  this.isPrime = ko.computed(function() {
    if (this.parameters() === null) {
      return null;
    }
    return this.parameters().isPrime || false;
  }, this);

  this.outputTemplate = ko.computed(function() {
    if (this.n() === null) {
      return 'aks.error.invalidN';
    }
    if (this.n().lt(2)) {
      return 'aks.error.outOfBoundsN';
    }
    return 'aks.success';
  }, this);
}

ko.applyBindings(new AKSViewModel(),
                 document.getElementById('aksExample'));
