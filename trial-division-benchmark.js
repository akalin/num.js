'use strict';

function makeTrialDivideSuite(o, outputFn) {
  var suite = new Benchmark.Suite();

  suite.add('naive', function() {
    trialDivide(o, makeNaiveDivisorGenerator(), function() {});
  })
  .add('mod-30 wheel', function() {
    trialDivide(o, makeMod30WheelDivisorGenerator(), function() {});
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
