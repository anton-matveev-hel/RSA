<h3>Program Structure</h3>
* ***./Documentation*** - documentation files
* ***./src*** - source code files
  * ***/lib*** - program implementation
    * ***/index.js*** - implements CLI
    * ***/PEM.js*** - implements PEM encoding and decoding of RSA keys
    * ***/RSA.js*** - implements RSA keys generation, encryption and decryption
    * ***/prime-numbers.js*** - implements generation of random large prime numbers
    * ***/random-numbers.js*** - implements generation of random large numbers
    * ***/util.js*** - implements generic utility functions used by other modules
  * ***/test*** - program tests
    * ***/integration*** - integration tests
    * ***/unit*** - unit tests

<h3>Time Complexities</h3>
* ***util.js***
    * modPow has the worst-case complexity of O(n<sup>3</sup>) but in applications with a small constant exponent is actually proportionate to n<sup>2</sup>
    * modInverse has the worst-case complexity of O(n<sup>3</sup>).
* ***random-numbers.js***
  * Random Big Integer generation has the time complexity proportionate to the square of requested bit length - O(bitLength<sup>2</sup>).
* ***prime-numbers.js***
  * The main complexity factor of the Miller Rabin test is modular exponentiation, which yields the worst-case complexity of O(n<sup>3</sup>).
  * Based on probability of a random odd being prime, the worst case number of iterations of the Miller-Rabin test is proportionate to the bit length, which yields the overall complexity of O(n<sup>4</sup>).
* ***RSA.js***
  * In key generation, the main complexity factor is generation of two large primes, which yields O(n<sup>4</sup>).
  * In decryption, the main complexity factor is modular exponentiation which yields O(n<sup>3</sup>).
  * In encryption, the main complexity factor is modular exponentiation with a small constant exponent, which yields O(n<sup>2</sup>).

<h3>References</h3>
* Miller-Rabin primality test
  * [Wikipedia](https://en.wikipedia.org/wiki/Miller–Rabin_primality_test)
  * [Rosetta Code](https://rosettacode.org/wiki/Miller–Rabin_primality_test)
  * ChatGPT for simple explanation
* Sieve of Eratosthenes
  * [StackOverflow](https://stackoverflow.com/questions/15471291/sieve-of-eratosthenes-algorithm-in-javascript-running-endless-for-large-number)
* RSA
  * [Wikipedia](https://en.wikipedia.org/wiki/RSA_(cryptosystem))
  * [GeeksForGeeks](https://www.geeksforgeeks.org/rsa-algorithm-cryptography/)
  * [travist/jsencrypt](https://github.com/travist/jsencrypt)
* PEM
  * ChatGPT
  * [ASN1.JS Documentation](https://github.com/PeculiarVentures/asn1.js)
* CLI
  * [yargs Documentation](https://github.com/yargs/yargs)
* Time complexities
  * ChatGPT for identifying complexities of mathematical operations (modPow, modInverse).