'use strict';

function makeTrialDivideSuite(o, outputFn) {
  var suite = new Benchmark.Suite();

  var processPrimeFactor = function() {
    return true;
  };

  suite.add('naive', function() {
    trialDivide(o, makeNaiveDivisorGenerator(), processPrimeFactor);
  })
  .add('mod-30 wheel', function() {
    trialDivide(o, makeMod30WheelDivisorGenerator(), processPrimeFactor);
  });

  var os = o.toString();
  suite.on('start', function() {
    outputFn(os + ': start');
  });
  suite.on('cycle', function(event, bench) {
    outputFn(os + ': ' + bench.toString());
  });
  suite.on('complete', function() {
    outputFn(os + ': complete');
  });

  return suite;
}
