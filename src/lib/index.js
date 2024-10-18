const rsa = require("./RSA");
const pem = require("./PEM");
const fs = require("fs");

const keys = rsa.generateKeys(2048);
const { p, q, d, n, e } = keys;
console.log( keys );
// const publicPem = pem.encodePublicKeyToPEM(n, e);
// fs.writeFileSync("pub_key.pem", publicPem);
// const privatePem = pem.encodePrivateKeyToPEM(p, q, d, n, e);
// fs.writeFileSync("key.pem", privatePem);