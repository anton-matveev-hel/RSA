const rsa = require("./RSA");
const pem = require("./PEM");
const fs = require("fs");
const yargs = require("yargs");


const options = yargs
    .usage(usage)
    .option("l", {alias:"languages", describe: "List all supported languages.", type: "boolean", demandOption
            : false })
    .help(true).argv;
