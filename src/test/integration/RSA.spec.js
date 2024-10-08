const rsa = require('../../lib/RSA');
const assert = require('node:assert').strict;

describe("Module RSA - for RSA encryption and decryption.", () => {
    test("Generates keys which can be used to encrypt and decrypt a message.", () => {
        const keys = rsa.generateKeys(2048);
        const message = `
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut laoreet nibh id maximus sollicitudin. 
        Phasellus dictum id sem id pulvinar. Sed venenatis nisi sit amet ipsum vulputate, sed interdum nunc pharetra.
        `;
        const encrypted = rsa.encrypt(message, keys.e, keys.n);
        const decrypted = rsa.decrypt(encrypted, keys.d, keys.n);
        assert.equal(message, decrypted);
    });
});