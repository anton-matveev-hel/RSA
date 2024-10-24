const asn1js = require("asn1js");
const util = require("./util");

module.exports = {
    encodePrivateKey: function(p, q, d, n, e) {
        const version = new asn1js.Integer( { value: 0 } );

        const modulus = this._encodeASN1Integer(n);
        const publicExponent = this._encodeASN1Integer(e);
        const privateExponent = this._encodeASN1Integer(d);
        const prime1 = this._encodeASN1Integer(p);
        const prime2 = this._encodeASN1Integer(q);
        const exponent1 = this._encodeASN1Integer(d % (p - 1n));
        const exponent2 = this._encodeASN1Integer(d % (q - 1n));
        const coefficient = this._encodeASN1Integer(util.modInverse(q, p));

        const sequence = this._encodeASN1Sequence( [
            version,
            modulus,
            publicExponent,
            privateExponent,
            prime1,
            prime2,
            exponent1,
            exponent2,
            coefficient,
        ] );

        const derEncoded = sequence.toBER( false );
        const base64String = this._arrayBufferToBase64( derEncoded );
        const pemString = this._wrapPEM( base64String, 'RSA PRIVATE KEY' );

        return pemString;
    },

    encodePublicKey: function(n, e) {
        // Encode the RSA public key as in PKCS#1
        const modulus = this._encodeASN1Integer(n);
        const publicExponent = this._encodeASN1Integer(e);
        const rsaPublicKeySequence = this._encodeASN1Sequence([modulus, publicExponent]);
        const rsaPublicKeyDer = rsaPublicKeySequence.toBER(false);

        // AlgorithmIdentifier for RSA Encryption
        const algorithmIdentifierSequence = this._encodeASN1Sequence([
            new asn1js.ObjectIdentifier({ value: '1.2.840.113549.1.1.1' }), // rsaEncryption OID
            new asn1js.Null(), // Parameters are NULL for rsaEncryption
        ]);

        // SubjectPublicKeyInfo
        const subjectPublicKeyInfoSequence = this._encodeASN1Sequence([
            algorithmIdentifierSequence,
            new asn1js.BitString( { valueHex: rsaPublicKeyDer } ),
        ]);

        const derEncoded = subjectPublicKeyInfoSequence.toBER(false);
        const base64String = this._arrayBufferToBase64(derEncoded);
        return this._wrapPEM(base64String, 'PUBLIC KEY');
    },

    decodePrivateKey: function(pemString) {
        let base64;
        try {
            base64 = this._unwrapPEM(pemString, "RSA PRIVATE KEY")
        } catch(e) {
            throw("Incorrect private key format.");
        }
        const arrayBuffer = this._base64ToArrayBuffer(base64);
        const asn1 = asn1js.fromBER(arrayBuffer);
        if (asn1.offset === -1) {
            throw new Error('Error parsing ASN.1 structure');
        }

        // RSAPrivateKey structure
        const rsaPrivateKey = asn1.result;

        const modulus = rsaPrivateKey.valueBlock.value[1].valueBlock.valueHex;
        const publicExponent = rsaPrivateKey.valueBlock.value[2].valueBlock.valueHex;
        const privateExponent = rsaPrivateKey.valueBlock.value[3].valueBlock.valueHex;

        return {
            n: BigInt("0x" + this._bufferToHex(modulus)),
            e: BigInt("0x" + this._bufferToHex(publicExponent)),
            d: BigInt("0x" + this._bufferToHex(privateExponent)),
        };
    },

    decodePublicKey: function(pemString) {
        let base64;
        try {
            base64 = this._unwrapPEM(pemString,"PUBLIC KEY")
        } catch(e) {
            throw("Incorrect public key format.");
        }
        const arrayBuffer = this._base64ToArrayBuffer(base64);
        const asn1 = asn1js.fromBER(arrayBuffer);
        if (asn1.offset === -1) {
            throw new Error('Error parsing ASN.1 structure');
        }

        let modulus, publicExponent;

        const subjectPublicKeyInfo = asn1.result;
        const bitString = subjectPublicKeyInfo.valueBlock.value[1];
        if (bitString.idBlock.tagClass !== 1 || bitString.idBlock.tagNumber !== 3) {
            throw new Error('Expected a BIT STRING for public key data');
        }
        const rsaPublicKeyASN1 = bitString.valueBlock.value[0];
        if (rsaPublicKeyASN1.offset === -1) {
            throw new Error('Error parsing RSA public key');
        }
        const rsaPublicKey = rsaPublicKeyASN1.valueBlock;
        modulus = rsaPublicKey.value[0].valueBlock.valueHex;
        publicExponent = rsaPublicKey.value[1].valueBlock.valueHex;

        return {
            n: BigInt("0x" + this._bufferToHex(modulus)),
            e: BigInt("0x" + this._bufferToHex(publicExponent)),
        };
    },

    _encodeASN1Integer: function ( bigIntValue ) {
        // Convert BigInt to Uint8Array
        let hex = bigIntValue.toString( 16 );
        if ( hex.length % 2 ) {
            hex = '0' + hex;
        }
        const byteArray = Uint8Array.from( hex.match( /.{1,2}/g ).map( byte => parseInt( byte, 16 ) ) );

        // Handle negative numbers
        if ( byteArray[ 0 ] & 0x80 ) {
            const newByteArray = new Uint8Array( byteArray.length + 1 );
            newByteArray[ 0 ] = 0x00;
            newByteArray.set( byteArray, 1 );
            return new asn1js.Integer( { valueHex: newByteArray.buffer } );
        }

        return new asn1js.Integer( { valueHex: byteArray.buffer } );
    },

    _encodeASN1Sequence: function ( elements ) {
        return new asn1js.Sequence( { value: elements } );
    },

    _arrayBufferToBase64: function ( buffer ) {
        const byteArray = new Uint8Array( buffer );
        let binary = '';
        for ( let i = 0; i < byteArray.byteLength; i++ ) {
            binary += String.fromCharCode( byteArray[ i ] );
        }
        return btoa( binary );
    },

    _wrapPEM: function(base64String, label) {
        const pemHeader = `-----BEGIN ${label}-----\n`;
        const pemFooter = `\n-----END ${label}-----\n`;

        // Split the Base64 string into lines of 64 characters
        const lineLength = 64;
        const lines = base64String.match( new RegExp( '.{1,' + lineLength + '}', 'g' ) );

        return pemHeader + lines.join( '\n' ) + pemFooter;
    },

    _unwrapPEM: function(pemString, label) {
        return pemString
            .replace(`-----BEGIN ${label}-----`, '')
            .replace(`-----END ${label}-----`, '')
            .replace(/\s+/g, '');
    },

    _base64ToArrayBuffer: function(base64) {
        // In Node.js
        const buffer = Buffer.from(base64, 'base64');
        return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
    },

    _bufferToHex: function(arrayBuffer) {
        const byteArray = new Uint8Array(arrayBuffer);
        let hexString = '';
        for (let i = 0; i < byteArray.length; i++) {
            const hex = byteArray[i].toString(16).padStart(2, '0');
            hexString += hex;
        }
        return hexString;
    }
};
