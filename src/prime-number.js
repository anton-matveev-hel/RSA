const crypto = require("crypto");

module.exports = {
    getRandomPrime: function(bitLength) {
        let prime;
        do {
            prime = this.getRandomBigInt(bitLength);
            // Ensure the prime is odd and has the correct bit length
            prime |= 1n;
            prime |= 1n << BigInt(bitLength - 1);
        } while (!this.isProbablyPrime(prime));
        return prime;
    },

    getRandomBigInt: function(bitLength) {
        const byteLength = Math.ceil(bitLength / 8);
        const randomBytes = new Uint8Array(byteLength);
        crypto.getRandomValues(randomBytes);
        let randomBigInt = 0n;
        for (const byte of randomBytes) {
            randomBigInt = (randomBigInt << 8n) + BigInt(byte);
        }
        return randomBigInt;
    },

    getRandomBits: function(bitLength) {
        const byteLength = Math.ceil(bitLength / 8);
        const randomBytes = new Uint8Array(byteLength);
        crypto.getRandomValues(randomBytes);
        let randomBigInt = 0n;
        for (const byte of randomBytes) {
            randomBigInt = (randomBigInt << 8n) + BigInt(byte);
        }
        return randomBigInt;
    },

    getRandomBigIntInRange: function(min, max) {
        const range = max - min + 1n;
        const bitLength = range.toString(2).length;
        let randomBigInt;
        do {
            randomBigInt = this.getRandomBits(bitLength);
        } while (randomBigInt > range);
        return randomBigInt + min;
    },

    modPow: function(base, exponent, modulus) {
        if (modulus === 1n) return 0n;
        let result = 1n;
        base = base % modulus;
        while (exponent > 0n) {
            if (exponent % 2n === 1n) {
                result = (result * base) % modulus;
            }
            exponent = exponent / 2n;
            base = (base * base) % modulus;
        }
        return result;
    },

    isProbablyPrime: function(n, rounds = 40) {
        if (n === 2n || n === 3n) return true;
        if (n <= 1n || n % 2n === 0n) return false;

        const { s, d } = this._findSandD(n);

        OuterLoop:
        for (let i = 0; i < rounds; i++) {
            // Choose a random integer a in [2, n - 2]
            const a = this.getRandomBigIntInRange(2n, n - 2n);

            // Compute x = a^d mod n
            let x = this.modPow(a, d, n);

            if (x === 1n || x === n - 1n) continue;

            for (let r = 1n; r < s; r++) {
                x = this.modPow(x, 2n, n);

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