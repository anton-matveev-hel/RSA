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

    decrypt: function(encryptedBlocks, d, n) {
        const decryptedBytes = [];
        encryptedBlocks.forEach(c => {
            let m = util.modPow(c, d, n);
            const blockBytes = [];
            while (m > 0n) {
                blockBytes.unshift(Number(m % 256n));
                m = m / 256n;
            }
            decryptedBytes.push(...blockBytes);
        });
        const decoder = new TextDecoder();
        return decoder.decode(new Uint8Array(decryptedBytes));
    },

    encrypt: function(message, e, n) {
        const maxLength = Math.floor((n.toString(2).length - 1) / 8);
        const blocks = this._splitMessage(message, maxLength);
        return blocks.map(block => {
            let m = 0n;
            for (const byte of block) {
                m = (m << 8n) + BigInt(byte);
            }
            return util.modPow(m, e, n);
        });
    },

    _gcd: function(a, b) {
        while (b !== 0n) {
            [a, b] = [b, a % b];
        }
        return a;
    },

    _splitMessage: function(message, maxLength) {
        const encoder = new TextEncoder();
        const bytes = encoder.encode(message);
        const blocks = [];
        for (let i = 0; i < bytes.length; i += maxLength) {
            blocks.push(bytes.slice(i, i + maxLength));
        }
        return blocks;
    }

}