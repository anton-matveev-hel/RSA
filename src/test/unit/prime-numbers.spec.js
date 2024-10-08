const randomNumbers = require("../../lib/random-numbers")
const primeNumbers = require("../../lib/prime-numbers");
const assert = require('node:assert').strict;

describe("Module prime-numbers - for generating Big Integer prime numbers.", () => {
    describe("Method isProbablyPrime - checks if a number is likely prime.", () => {
        test("Rejects large compound numbers", () => {
            for(let i = 0; i < 10; i++) {
                let number = randomNumbers.getRandomBigInt(2048); // Arbitrarily-long number
                number |= 1n; // Set its last bit to 1, so that it's odd;
                number *= 3n; // Multiply by 3, so that it's still odd but definitely compound;
                assert(!primeNumbers.isProbablyPrime(number));
            }
        }, 1000); // Set the test timeout to 1 second - the algorithm is supposed to verify primality quickly.

        test("Accepts known prime numbers", () => {
            assert(primeNumbers.isProbablyPrime(9990450013n)); // The numbers were picked randomly from prime-numbers.org
            assert(primeNumbers.isProbablyPrime(9990450403n));
            assert(primeNumbers.isProbablyPrime(9990451439n));
            assert(primeNumbers.isProbablyPrime(9988050641n));
            assert(primeNumbers.isProbablyPrime(9988053227n));
            assert(primeNumbers.isProbablyPrime(9988054187n));
            assert(primeNumbers.isProbablyPrime(9988046317n));
            assert(primeNumbers.isProbablyPrime(9988046773n));
            assert(primeNumbers.isProbablyPrime(9988048381n));
        }, 1000); // Set the test timeout to 1 second - the algorithm is supposed to verify primality quickly.
    });
});