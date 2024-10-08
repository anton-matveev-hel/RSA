const randomNumbers = require("../../lib/random-numbers")
const assert = require('node:assert').strict;

describe("Module randomNumbers - utility functions for the project.", () => {
    describe("Method getRandomBigInt - generates a random Big Integer of provided bit length.", () => {
        test("All generated numbers have requested bit length.", () => {
            for(let i = 0; i < 100; i++) {
                const bitLength = Math.floor(Math.random() * 1000); // Get a random bit length in range [0, 100000]
                const number = randomNumbers.getRandomBigInt(bitLength);
                assert.equal(number.toString(2).length, bitLength);
            }
        });
    });
    describe("Method getRandomBigIntInRange - generates a random Big Integer in range.", () => {
        test("All generated numbers are within provided range.", () => {
            const min = 662981253523541244n; // Arbitrary lower bound
            const max = 2n*min;
            for(let i = 0; i < 100; i++) {
                const number = randomNumbers.getRandomBigIntInRange(min, max);
                assert(number >= min);
                assert(number <= max);
            }
        });

        test("Throws with negative range.", () => {
            assert.throws(() => randomNumbers.getRandomBigIntInRange(100n, 1n));
        });
    });
});