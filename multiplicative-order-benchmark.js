'use strict';

function makeMultiplicativeOrderSuite(o, outputFn) {
  var suite = new Benchmark.Suite();

  suite.add('calculateMultiplicativeOrderNaive', function() {
    calculateMultiplicativeOrderNaive(2, o);
  });

  suite.add('calculateMultiplicativeOrderPrimePower', function() {
    calculateMultiplicativeOrderPrimePower(2, o, 1);
  });

  suite.add('calculateMultiplicativeOrderCRT', function() {
    calculateMultiplicativeOrderCRT(2, o);
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

function makeMultiplicativeOrderBenchmark(outputFn) {
  var testModuli = [ '101', '1009', '10007' ];
  return testModuli.map(function(o) {
    return makeMultiplicativeOrderSuite(o, outputFn);
  });
}
