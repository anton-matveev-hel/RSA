const crypto = require( "crypto" );
module.exports = {
    /**
     * Get a random Big Integer of provided bit length.
     *
     * @param bitLength {number} Bit Length of the number to generate.
     * @returns {BigInt}
     */
    getRandomBigInt: function(bitLength) {
        const byteLength = Math.ceil(bitLength / 8);
        const randomBytes = new Uint8Array(byteLength);
        crypto.getRandomValues(randomBytes); // crypto provides reliable random numbers that are applicable in cryptography algorithms
        let randomBigInt = 0n;
        for (const byte of randomBytes) {
            randomBigInt = (randomBigInt << 8n) | BigInt(byte);
        }
        // Adjust to the exact number of bits
        const excessBits = (byteLength * 8) - bitLength;
        if (excessBits > 0) {
            randomBigInt >>= BigInt(excessBits);
        }
        // Set the most significant bit to 1 to ensure requested bit length
        randomBigInt = randomBigInt | (1n << BigInt(bitLength - 1));
        return randomBigInt;
    },

    /**
     * Get a random Big Integer in range.
     *
     * @param min {BigInt} Minimum value.
     * @param max {BigInt} Maximum value.
     * @returns {BigInt}
     */
    getRandomBigIntInRange: function(min, max) {
        const range = max - min + 1n;
        if(range <= 0) {
            throw Error("Range must be positive.");
        }
        const bitLength = range.toString(2).length;
        let randomBigInt;
        do {
            randomBigInt = this.getRandomBigInt(bitLength)
        } while(randomBigInt >= range);
        return randomBigInt + min;
    }
}