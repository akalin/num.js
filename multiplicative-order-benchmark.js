'use strict';

function makeMultiplicativeOrderSuite(o, outputFn) {
  var suite = new Benchmark.Suite();

  suite.add('calculateMultiplicativeOrderNaive', function() {
    calculateMultiplicativeOrderNaive(2, o);
  });

  suite.add('calculateMultiplicativeOrderPrimePower', function() {
    calculateMultiplicativeOrderPrimePower(2, o, 1);
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
