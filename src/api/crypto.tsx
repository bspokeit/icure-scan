/*
 * Copyright (C) 2022 Bspoke IT SRL
 *
 * This file is part of icure-scan.
 *
 * icure-scan is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * icure-scan is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with icure-scan.  If not, see <http://www.gnu.org/licenses/>.
 */
import 'react-native-get-random-values';
const msrCrypto = require('./support/msr-crypto.js');

const jwkToPem = require('jwk-to-pem');

const importKey = (
  format: KeyFormat,
  keyData: JsonWebKey,
  algorithm:
    | AlgorithmIdentifier
    | RsaHashedImportParams
    | EcKeyImportParams
    | HmacImportParams
    | AesKeyAlgorithm,
  extractable: boolean,
  keyUsages: ReadonlyArray<KeyUsage>,
): Promise<CryptoKey> => {
  return msrCrypto.subtle.importKey(
    format,
    keyData,
    algorithm,
    extractable,
    keyUsages,
  );
};

const exportKey = (format: 'jwk', key: CryptoKey): Promise<JsonWebKey> => {
  return msrCrypto.subtle.exportKey(format, key);
};

const encrypt = (
  algorithm:
    | AlgorithmIdentifier
    | RsaOaepParams
    | AesCtrParams
    | AesCbcParams
    | AesGcmParams,
  key: CryptoKey,
  data: BufferSource,
) => {
  console.log('TSX::encrypt algorithm: ', algorithm.name);

  return msrCrypto.subtle.encrypt(algorithm, key, data);
};

const decrypt = async (
  algorithm:
    | AlgorithmIdentifier
    | RsaOaepParams
    | AesCtrParams
    | AesCbcParams
    | AesGcmParams,
  key: CryptoKey,
  data: BufferSource,
) => {
  console.log('TSX::decrypt algorithm: ', algorithm.name);

  try {
    if (algorithm.name === 'RSA-OAEP') {
      console.log('key: ', key);
      const jwk = await exportKey('jwk', key);
      console.log('exportedKey: ', jwk);
      //  const privateKey = await RSA.convertJWKToPrivateKey(jwk, 'decrypt');
      //  console.log('privateKey: ', privateKey);

      const privateKey = jwkToPem(jwk, { private: true });

      var enc = new TextDecoder('utf-8');
    }
  } catch (error) {
    console.error(error);
  }

  //return RSA.decryptOAEP();

  return msrCrypto.subtle.decrypt(algorithm, key, data);
};

const crypto: Crypto = {
  getRandomValues: global.crypto.getRandomValues,
  subtle: {
    decrypt: decrypt,
    deriveBits: async (
      algorithm:
        | AlgorithmIdentifier
        | EcdhKeyDeriveParams
        | HkdfParams
        | Pbkdf2Params,
      baseKey: CryptoKey,
      length: number,
    ) => {
      return new ArrayBuffer(1);
    }, //: Promise<ArrayBuffer>;
    deriveKey: async (
      algorithm:
        | AlgorithmIdentifier
        | EcdhKeyDeriveParams
        | HkdfParams
        | Pbkdf2Params,
      baseKey: CryptoKey,
      derivedKeyType:
        | AlgorithmIdentifier
        | AesDerivedKeyParams
        | HmacImportParams
        | HkdfParams
        | Pbkdf2Params,
      extractable: boolean,
      keyUsages: KeyUsage[],
    ) => {
      return new CryptoKey();
    }, //: Promise<CryptoKey>;
    digest: async (algorithm: AlgorithmIdentifier, data: BufferSource) => {
      return new ArrayBuffer(1);
    }, //: Promise<ArrayBuffer>;
    encrypt: encrypt,
    exportKey: exportKey,
    generateKey: async (
      algorithm: RsaHashedKeyGenParams | EcKeyGenParams,
      extractable: boolean,
      keyUsages: ReadonlyArray<KeyUsage>,
    ) => {
      return {} as CryptoKeyPair;
    }, //: Promise<CryptoKeyPair>;
    importKey: importKey,
    sign: async (
      algorithm: AlgorithmIdentifier | RsaPssParams | EcdsaParams,
      key: CryptoKey,
      data: BufferSource,
    ) => {
      return new ArrayBuffer(1);
    }, //: Promise<ArrayBuffer>;
    unwrapKey: async (
      format: KeyFormat,
      wrappedKey: BufferSource,
      unwrappingKey: CryptoKey,
      unwrapAlgorithm:
        | AlgorithmIdentifier
        | RsaOaepParams
        | AesCtrParams
        | AesCbcParams
        | AesGcmParams,
      unwrappedKeyAlgorithm:
        | AlgorithmIdentifier
        | RsaHashedImportParams
        | EcKeyImportParams
        | HmacImportParams
        | AesKeyAlgorithm,
      extractable: boolean,
      keyUsages: KeyUsage[],
    ) => {
      return new CryptoKey();
    }, //: Promise<CryptoKey>;
    verify: async (
      algorithm: AlgorithmIdentifier | RsaPssParams | EcdsaParams,
      key: CryptoKey,
      signature: BufferSource,
      data: BufferSource,
    ) => {
      return false;
    }, //: Promise<boolean>;
    wrapKey: async (
      format: KeyFormat,
      key: CryptoKey,
      wrappingKey: CryptoKey,
      wrapAlgorithm:
        | AlgorithmIdentifier
        | RsaOaepParams
        | AesCtrParams
        | AesCbcParams
        | AesGcmParams,
    ) => {
      return new ArrayBuffer(1);
    }, //: Promise<ArrayBuffer>;
  } as SubtleCrypto,
  randomUUID: () => {
    return '';
  },
};

export default {
  ...crypto,
};
