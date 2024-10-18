const asn1js = require("asn1js");
const util = require("./util");

module.exports = {
    encodePrivateKeyToPEM: function ( p, q, d, n, e ) {
        const version = new asn1js.Integer( { value: 0 } );

        const modulus = this._encodeASN1Integer( n );
        const publicExponent = this._encodeASN1Integer( e );
        const privateExponent = this._encodeASN1Integer( d );
        const prime1 = this._encodeASN1Integer( p );
        const prime2 = this._encodeASN1Integer( q );
        const exponent1 = this._encodeASN1Integer( d % ( p - 1n ) );
        const exponent2 = this._encodeASN1Integer( d % ( q - 1n ) );
        const coefficient = this._encodeASN1Integer( util.modInverse( q, p ) );

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

    encodePublicKeyToPEM: function ( n, e ) {
        // Encode the RSA public key as in PKCS#1
        const modulus = this._encodeASN1Integer( n );
        const publicExponent = this._encodeASN1Integer( e );
        const rsaPublicKeySequence = this._encodeASN1Sequence( [ modulus, publicExponent ] );
        const rsaPublicKeyDer = rsaPublicKeySequence.toBER( false );

        // AlgorithmIdentifier for RSA Encryption
        const algorithmIdentifierSequence = this._encodeASN1Sequence( [
            new asn1js.ObjectIdentifier( { value: '1.2.840.113549.1.1.1' } ), // rsaEncryption OID
            new asn1js.Null(), // Parameters are NULL for rsaEncryption
        ] );

        // SubjectPublicKeyInfo
        const subjectPublicKeyInfoSequence = this._encodeASN1Sequence( [
            algorithmIdentifierSequence,
            new asn1js.BitString( { valueHex: rsaPublicKeyDer } ),
        ] );

        const derEncoded = subjectPublicKeyInfoSequence.toBER( false );
        const base64String = this._arrayBufferToBase64( derEncoded );
        const pemString = this._wrapPEM( base64String, 'PUBLIC KEY' );

        return pemString;
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

    _wrapPEM: function ( base64String, label ) {
        const pemHeader = `-----BEGIN ${label}-----\n`;
        const pemFooter = `\n-----END ${label}-----\n`;

        // Split the Base64 string into lines of 64 characters
        const lineLength = 64;
        const lines = base64String.match( new RegExp( '.{1,' + lineLength + '}', 'g' ) );

        return pemHeader + lines.join( '\n' ) + pemFooter;
    }
};
