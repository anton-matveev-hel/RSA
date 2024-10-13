const rsa = require('../../lib/RSA');
const assert = require('node:assert').strict;

describe("Module RSA - for RSA encryption and decryption.", () => {
    test("Generates keys which can be used to encrypt and decrypt a message.", () => {
        const keys = rsa.generateKeys(2048);
        const message = `
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vitae lectus non nisl iaculis malesuada eget eu 
        massa. Donec placerat, mauris id ullamcorper imperdiet, lectus dolor varius lectus, vitae aliquam metus nibh id 
        diam. Donec condimentum nibh ante, at finibus enim fermentum sed. Phasellus et tincidunt mauris. Mauris mollis 
        semper erat a porta. Morbi porta vehicula est, a ultricies nulla molestie at. Mauris sodales dignissim urna vitae 
        ullamcorper. Duis tincidunt erat imperdiet, efficitur metus ac, venenatis diam. Morbi vel turpis varius, 
        pellentesque enim vel, luctus metus. Nam suscipit turpis id purus auctor, nec efficitur mauris tempus. Praesent 
        dictum nec felis sit amet convallis. In odio sem, iaculis nec sodales id, commodo et ligula. Nullam vestibulum, 
        dolor eget aliquet porttitor, lorem enim tincidunt ex, vitae blandit libero neque ut lectus. Sed tempor interdum 
        turpis, non tincidunt ipsum aliquet vel. Maecenas feugiat tortor felis, ullamcorper iaculis massa euismod sit amet. 
        Maecenas eget nunc justo. Integer iaculis vitae nisi eu malesuada. Duis ac nunc imperdiet, consequat nisi eu, sagittis 
        purus. Vestibulum ac purus ipsum. Praesent quis nisi semper, dapibus tellus sit amet, consectetur tellus. Morbi purus sem, 
        porttitor sit amet condimentum quis, eleifend facilisis leo. Sed dignissim, mi sit amet dignissim vulputate, sem nunc viverra odio, 
        in cursus leo turpis vitae tellus. Vivamus vel ultricies nunc. Aliquam quis commodo lectus, sagittis pulvinar tellus. 
        Fusce fermentum vestibulum velit. Aenean metus nibh, congue at rutrum id, dapibus sit amet diam. Praesent id turpis 
        maximus, mollis elit eu, sagittis lorem. Maecenas nec elit at metus tincidunt varius. Pellentesque feugiat interdum 
        nunc id venenatis. Mauris felis enim, auctor sed scelerisque et, finibus eu dui. Donec ut vehicula quam. Fusce quam 
        sapien, vulputate a fermentum et, tempus scelerisque neque. Vivamus efficitur sapien vel nibh consectetur porttitor. 
        Duis pellentesque vitae lacus in metus.
        `;
        const encrypted = rsa.encrypt(message, keys.e, keys.n);
        const decrypted = rsa.decrypt(encrypted, keys.d, keys.n);
        assert.equal(message, decrypted);
    });
});