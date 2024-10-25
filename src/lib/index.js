const rsa = require("./RSA");
const pem = require("./PEM");
const fs = require("fs");
require('yargs')
    .scriptName("rsa")
    .usage('$0 <cmd> [args]')
    .command('generate-keys [bitLength]', 'Generate RSA keys of specified bit length', (yargs) => {
        yargs.positional('bitLength', {
            type: 'number',
            default: '2048',
            describe: 'Required bit length.'
        });
        yargs.option('n', {
            alias: 'name',
            default: 'key',
            describe: 'Key name. Generated files will have names in format [name].public.pem and [name].private.pem.'
        });
    }, generateKeys)
    .command('encrypt [file]', "Encrypt a file with provided public RSA key in PEM format.", (yargs) => {
        yargs.positional('file', {
            type: 'string',
            describe: 'Path of file to encrypt.'
        });
        yargs.option('k', {
            alias: 'key',
            describe: 'Path to a public RSA key in PEM format.'
        });
        yargs.option('o', {
            alias: "out",
            describe: 'Out file path.'
        });
    }, encrypt)
    .command('decrypt [file]', "Decrypt a file with provided private RSA key in PEM format.", (yargs) => {
        yargs.positional('file', {
            type: 'string',
            describe: 'Path of file to decrypt.'
        });
        yargs.option('k', {
            alias: 'key',
            describe: 'Path to a private RSA key in PEM format.'
        });
        yargs.option('o', {
            alias: "out",
            describe: 'Out file path.'
        });
    }, decrypt)
    .help()
    .argv


function generateKeys(argv) {
    console.log(`Generating RSA keys of length ${argv.bitLength}...`);
    const keys = rsa.generateKeys(argv.bitLength);
    const publicPem = pem.encodePublicKey(keys.n, keys.e);
    const publicName = `${argv.name}.public.pem`;
    fs.writeFileSync(publicName, publicPem);
    const privatePem = pem.encodePrivateKey(...Object.values(keys));
    const privateName = `${argv.name}.private.pem`;
    fs.writeFileSync(privateName, privatePem);
    console.log(`${publicName} and ${privateName} successfully generated.`);
}

function encrypt(argv) {
    console.log(`Encrypting ${argv.file} with ${argv.k}...`);
    const pemString = fs.readFileSync(argv.k, {encoding: "utf8"});
    const key = pem.decodePublicKey(pemString);
    const message = fs.readFileSync(argv.file, {encoding: "utf8"});
    const blocks = rsa.encrypt(message, key.e, key.n);
    const stringBlocks = blocks.map(block => block.toString());
    const buffer = Buffer.from(JSON.stringify(stringBlocks));
    fs.writeFileSync(argv.o, buffer.toString("base64"), { encoding: "utf8" });
    console.log(`Successfully created ${argv.o}.`);
}

function decrypt(argv) {
    console.log(`Decrypting ${argv.file} with ${argv.k}...`);
    const pemString = fs.readFileSync(argv.k, {encoding: "utf8"});
    const key = pem.decodePrivateKey(pemString);
    const base64Message = fs.readFileSync(argv.file, {encoding: "utf8"});
    const buffer = Buffer.from(base64Message, "base64");
    const stringBlocks = JSON.parse(buffer.toString("utf8"));
    const blocks = stringBlocks.map(block => BigInt(block));
    const message = rsa.decrypt(blocks, key.d, key.n);
    fs.writeFileSync(argv.o, message, { encoding: "utf8" });
    console.log(`Successfully created ${argv.o}.`);
}