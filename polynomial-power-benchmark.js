'use strict';

function makePolynomialPowerSuite(o, outputFn) {
  var suite = new Benchmark.Suite();

  var onePoly = new SPoly(new SNat(1));
  var xPlusOne = onePoly.shiftLeft(1).plus(onePoly);

  suite.add('x+1', function() {
    xPlusOne.pow(o);
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

function makePolynomialPowerBenchmark(outputFn) {
  var testPowers = [ '10', '50', '100', '200' ];
  return testPowers.map(function(o) {
    return makePolynomialPowerSuite(o, outputFn);
  });
}
