module.exports = {

    /**
     * Computes the modular exponentiation of a base raised to an exponent modulo a modulus.
     * Efficiently calculates (base ** exponent) % modulus using the binary exponentiation method.
     *
     * @param {BigInt} base - The base number.
     * @param {BigInt} exponent - The exponent to raise the base.
     * @param {BigInt} modulus - The modulus to apply.
     * @returns {BigInt} The result of (base ** exponent) % modulus.
     */
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

    modInverse: function(a, m) {
        let [ m0, x0, x1 ] = [ m, 0n, 1n ];
        if ( m === 1n ) return 0n;
        while ( a > 1n ) {
            const q = a / m;
            [ a, m ] = [ m, a % m ];
            [ x0, x1 ] = [ x1 - q * x0, x0 ];
        }
        if ( x1 < 0n ) x1 += m0;
        return x1;
    }
}