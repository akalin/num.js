'use strict';

function makeAKSSuite(o, outputFn) {
  var suite = new Benchmark.Suite();

  var parameters = getAKSParametersSimple(o);

  suite.add('isAKSWitness', function() {
    isAKSWitness(parameters.n, parameters.r, 2);
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

function makeAKSBenchmark(outputFn) {
  var testPowers = [ '17', '739', '23677', '877739' ];
  return testPowers.map(function(o) {
    return makeAKSSuite(o, outputFn);
  });
}
