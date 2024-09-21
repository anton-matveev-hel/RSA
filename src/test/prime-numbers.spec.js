const primeNumbers = require("../lib/prime-number");
const assert = require('node:assert').strict;

describe("Module prime-numbers - for generating Big Integer prime numbers.", () => {
    describe("Method isProbablyPrime - checks if a number is likely prime.", () => {
        test( "Immediately rejects even numbers", () => {
            for(let i = 0; i < 100; i++) {
                let number = primeNumbers.getRandomBigInt(2048); // Arbitrarily-long number
                number |= 0n; // Set its last bit to 0, so that it's even
                assert(!primeNumbers.isProbablyPrime(number, 1000)); // Arbitrarily many rounds (40 is usually enough in real cases)
            }
        }, 2000); // Setting test timeout to 2 seconds. The method will not process the numbers quick enough without immediately rejecting evens.

        test( "Rejects large compound numbers", () => {
            for(let i = 0; i < 10; i++) {
                let number = primeNumbers.getRandomBigInt(2048); // Arbitrarily-long number
                number |= 1n; // Set its last bit to 0, so that it's odd;
                number *= 3n; // Multiply by 3, so that it's still odd but definitely compound;
                assert(!primeNumbers.isProbablyPrime(number));
            }
        }, 2000);

        test( "Accepts known prime numbers", () => {
            assert(primeNumbers.isProbablyPrime(9990450013n)); // The numbers were picked randomly from prime-numbers.org
            assert(primeNumbers.isProbablyPrime(9990450403n));
            assert(primeNumbers.isProbablyPrime(9990451439n));
            assert(primeNumbers.isProbablyPrime(9988050641n));
            assert(primeNumbers.isProbablyPrime(9988053227n));
            assert(primeNumbers.isProbablyPrime(9988054187n));
            assert(primeNumbers.isProbablyPrime(9988046317n));
            assert(primeNumbers.isProbablyPrime(9988046773n));
            assert(primeNumbers.isProbablyPrime(9988048381n));
        }, 2000);
    });
});