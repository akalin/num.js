'use strict';

function makePrimalityTestingSuite(o, outputFn) {
  var suite = new Benchmark.Suite();

  suite.add('is probable prime by Fermat', function() {
    isProbablePrime(o, hasFermatWitness);
  })
  .add('is probable prime by Artjuhov', function() {
    isProbablePrime(o, hasArtjuhovWitness);
  })
  .add('is prime by Miller', function() {
    isPrimeByMiller(o);
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

function makePrimalityTestingBenchmark(outputFn) {
  var testPrimes = ['100003', '10000019', '1000000007'];
  return testPrimes.map(function(o) {
    return makePrimalityTestingSuite(o, outputFn);
  });
}
