const util = require("./util");
const primeNumbers = require( "./prime-numbers" );

module.exports = {
    generateKeys: function(bitLength) {
        const p = primeNumbers.getRandomPrime(bitLength);
        let q;
        do {
            q = primeNumbers.getRandomPrime(bitLength);
            // Ensure p and q are not equal
        } while (q === p);
        const n = p * q;
        const phi = (p - 1n) * (q - 1n);
        const e = 65537n; // Common public exponent
        if (this._gcd(e, phi) !== 1n) {
            throw new Error("e and φ(n) are not coprime.");
        }
        const d = util.modInverse(e, phi);
        return { e, d, n };
    },

    decrypt: function(ciphertext, d, n) {
        const m = util.modPow(ciphertext, d, n);
        return this._decodeMessage(m);
    },

    encrypt: function(message, e, n) {
        const m = this._encodeMessage(message);
        if (m >= n) {
            throw new Error("Message too long for the key size.");
        }
        return util.modPow(m, e, n);
    },

    _gcd: function(a, b) {
        while (b !== 0n) {
            [a, b] = [b, a % b];
        }
        return a;
    },

    _decodeMessage: function(m) {
        const bytes = [];
        while (m > 0n) {
            bytes.unshift(Number(m % 256n));
            m = m / 256n;
        }
        const decoder = new TextDecoder();
        return decoder.decode(new Uint8Array(bytes));
    },

    _encodeMessage: function(message) {
        const encoder = new TextEncoder();
        const bytes = encoder.encode(message);
        let m = 0n;
        for (const byte of bytes) {
            m = (m << 8n) + BigInt(byte);
        }
        return m;
    }
}