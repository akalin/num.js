'use strict';

function TrialDivisionViewModel() {
  this.nStr = ko.observable('175507');

  this.n = ko.computed(function() {
    return SNat.tryCast(this.nStr());
  }, this);

  this.factors = ko.computed(function() {
    if (this.n() === null) {
      return [];
    }

    var factors = [];
    function appendFactor(factor) {
      factors.push(factor);
      return true;
    }
    trialDivide(this.n(), makeMod30WheelDivisorGenerator(), appendFactor);
    return factors;
  }, this);

  this.factorsStr = ko.computed(function() {
    return this.factors().join(', ');
  }, this);

  this.outputTemplate = ko.computed(function() {
    if (this.n() === null) {
      return 'trialDivision.error.invalidN';
    }
    if (this.factors().length == 0) {
      return 'trialDivision.success.noNonTrivialFactors';
    }
    return 'trialDivision.success.withNonTrivialFactors';
  }, this);
}

ko.applyBindings(new TrialDivisionViewModel(),
                 document.getElementById('trialDivisionExample'));
