'use strict';

// Data file of various interesting prime-number-related sequences.

// ( https://oeis.org/A000040 ) The first few prime numbers.
var smallPrimes =
  [2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,
   61,67,71,73,79,83,89,97,101,103,107,109,113,127,
   131,137,139,149,151,157,163,167,173,179,181,191,
   193,197,199,211,223,227,229,233,239,241,251,257,
   263,269,271];

// ( https://oeis.org/A000043 ) Primes p such that 2^p-1 is prime.
var mersenneExponents =
  [2,3,5,7,13,17,19,31,61,89,107,127,521,607,1279,
   2203,2281,3217,4253,4423,9689,9941,11213,19937,
   21701,23209,44497,86243,110503,132049,216091,
   756839,859433,1257787,1398269,2976221,3021377,
   6972593,13466917,20996011];