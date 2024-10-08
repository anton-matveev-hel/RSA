const util = require("./util");
const randomNumbers = require("./random-numbers")

module.exports = {
    getRandomPrime: function(bitLength) {
        let prime;
        do {
            prime = randomNumbers.getRandomBigInt(bitLength);
            // Ensure the prime is odd
            prime |= 1n;
        } while (!this.isProbablyPrime(prime));
        return prime;
    },

    /**
     * Determine if the number is likely a prime with Miller-Rabin primality test. Refer to
     * https://rosettacode.org/wiki/Miller%E2%80%93Rabin_primality_test for explanation.
     *
     * @param n {BigInt} Big Integer to test for primality
     * @param rounds {number} Number of test rounds. Defaults to 40.
     * @returns {boolean} **true** is the number is likely a prime.
     */
    isProbablyPrime: function(n, rounds = 40) {
        if (n === 2n || n === 3n) return true;
        if (n <= 1n || n % 2n === 0n) return false;

        const { s, d } = this._findSandD(n);

        OuterLoop:
        for (let i = 0; i < rounds; i++) {
            // Choose a random integer a in [2, n - 2]
            const a = randomNumbers.getRandomBigIntInRange(2n, n - 2n);

            // Compute x = a^d mod n
            let x = util.modPow(a, d, n);

            if (x === 1n || x === n - 1n) continue;

            for (let r = 1n; r < s; r++) {
                x = util.modPow(x, 2n, n);

                if (x === n - 1n) continue OuterLoop;
            }

            // Composite
            return false;
        }

        // Probably prime
        return true;
    },

    /**
     * Express n - 1 as 2^s * d.
     *
     * @param n
     * @returns {{s: bigint, d: bigint}}
     * @private
     */
    _findSandD: function(n) {
        let s = 0n;
        let d = n - 1n;
        while (d % 2n === 0n) {
            d /= 2n;
            s += 1n;
        }
        return { s, d };
    }
}