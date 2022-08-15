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

import {
  b64_2ab,
  b64_2ua,
  string2ab,
  string2ua,
  ua2b64,
  ua2string,
  ua2utf8,
} from '@icure/api/dist/icc-x-api/utils/binary-utils';
import { RNIcureRSA, RNIcureAES } from 'react-native-icure-crypto';
import { stringifyAESJWK, stringifyPrivateJWK, stringifyPublicJWK } from './key-helper';

import { v4 as uuidv4 } from 'uuid';

const msrCrypto = require('./support/msr-crypto.js');

type BufferSource = ArrayBuffer | ArrayBufferView;

export const tDecrypt = async (data: string, key: any) => {
  const b64Key = stringifyPrivateJWK(key);
  const decrypted = await RNIcureRSA.decrypt(data, b64Key);
  return decrypted;
};

export const tEncrypt = async (data: string, key: any) => {
  const b64Key = stringifyPublicJWK(key);
  const encrypted = await RNIcureRSA.encrypt(data, b64Key);
  return encrypted;
};

const decrypt = async (
  algorithm: AlgorithmIdentifier | RsaOaepParams | AesCtrParams | AesCbcParams | AesGcmParams,
  key: CryptoKey,
  data: BufferSource,
) => {
  try {
    if (algorithm.name === 'RSA-OAEP') {
      const privateKey = stringifyPrivateJWK(await exportKey('jwk', key));
      const toDecrypt = ua2b64(data as ArrayBuffer);
      const decrypted = await RNIcureRSA.decrypt(toDecrypt, privateKey);
      if (!!decrypted) {
        return string2ab(decrypted);
      }
    }

    if (algorithm.name === 'AES-CBC') {
      console.log('TSX::decrypt algorithm: ', algorithm.name);
      console.log('key: ', key);
      console.log('jwk: ', await exportKey('jwk', key));
      const aesKey = ua2b64((await exportKey('raw', key)) as ArrayBuffer);
      console.log('aesKey: ', aesKey);
      const toDecrypt = ua2b64(data as ArrayBuffer);
      console.log('toDecrypt: ', toDecrypt);
      const iv = ua2b64(algorithm.iv as ArrayBuffer);
      //console.log('iv: ', iv);
      const decrypted = await RNIcureAES.decrypt(toDecrypt, aesKey, iv);
      console.log('DECRYPTED_DECRYPTED_DECRYPTED: ', decrypted, b64_2ab(decrypted));
      if (!!decrypted) {
        console.log('b64_2ua: ', b64_2ab(decrypted));
        console.log('ua2utf8.b64_2ua: ', ua2utf8(b64_2ab(decrypted)));
        //return string2ab(decrypted);
      }
    }
  } catch (error) {
    console.error(error);
  }

  if (algorithm.name === 'AES-CBC') {
    const result = await msrCrypto.subtle.decrypt(algorithm, key, data);

    console.log('result: ', result);
  }

  return msrCrypto.subtle.decrypt(algorithm, key, data);
};

const deriveBits = async (
  algorithm: AlgorithmIdentifier | EcdhKeyDeriveParams | HkdfParams | Pbkdf2Params,
  baseKey: CryptoKey,
  length: number,
) => {
  return msrCrypto.subtle.deriveBits(algorithm, baseKey, length);
};

const deriveKey = async (
  algorithm: AlgorithmIdentifier | EcdhKeyDeriveParams | HkdfParams | Pbkdf2Params,
  baseKey: CryptoKey,
  derivedKeyType: AlgorithmIdentifier | AesDerivedKeyParams | HmacImportParams | HkdfParams | Pbkdf2Params,
  extractable: boolean,
  keyUsages: KeyUsage[],
) => {
  return msrCrypto.subtle.deriveKey(algorithm, baseKey, derivedKeyType, extractable, keyUsages);
};

const digest = async (algorithm: AlgorithmIdentifier, data: BufferSource) => {
  return msrCrypto.subtle.deriveKey(algorithm, data);
};

const encrypt = async (
  algorithm: AlgorithmIdentifier | RsaOaepParams | AesCtrParams | AesCbcParams | AesGcmParams,
  key: CryptoKey,
  data: BufferSource,
) => {
  console.log('TSX::encrypt algorithm: ', algorithm.name);

  try {
    if (algorithm.name === 'RSA-OAEP') {
      const publicKey = stringifyPublicJWK(await exportKey('jwk', key));
      const toEncrypt = ua2string(data as ArrayBuffer);
      const encrypted = await RNIcureRSA.encrypt(toEncrypt, publicKey);

      if (!!encrypted) {
        return b64_2ab(encrypted);
      }
    }
  } catch (error) {
    console.error(error);
  }

  return msrCrypto.subtle.encrypt(algorithm, key, data);
};

const exportKey = (format: 'jwk' | 'raw', key: CryptoKey): Promise<JsonWebKey> => {
  return msrCrypto.subtle.exportKey(format, key);
};

const generateKey = async (
  algorithm: RsaHashedKeyGenParams | EcKeyGenParams,
  extractable: boolean,
  keyUsages: ReadonlyArray<KeyUsage>,
) => {
  return msrCrypto.subtle.generateKey(algorithm, extractable, keyUsages);
};

const importKey = (
  format: KeyFormat,
  keyData: JsonWebKey,
  algorithm: AlgorithmIdentifier | RsaHashedImportParams | EcKeyImportParams | HmacImportParams | AesKeyAlgorithm,
  extractable: boolean,
  keyUsages: ReadonlyArray<KeyUsage>,
): Promise<CryptoKey> => {
  return msrCrypto.subtle.importKey(format, keyData, algorithm, extractable, keyUsages);
};

const sign = async (
  algorithm: AlgorithmIdentifier | RsaPssParams | EcdsaParams,
  key: CryptoKey,
  data: BufferSource,
) => {
  return msrCrypto.subtle.sign(algorithm, key, data);
};

const unwrapKey = async (
  format: KeyFormat,
  wrappedKey: BufferSource,
  unwrappingKey: CryptoKey,
  unwrapAlgorithm: AlgorithmIdentifier | RsaOaepParams | AesCtrParams | AesCbcParams | AesGcmParams,
  unwrappedKeyAlgorithm:
    | AlgorithmIdentifier
    | RsaHashedImportParams
    | EcKeyImportParams
    | HmacImportParams
    | AesKeyAlgorithm,
  extractable: boolean,
  keyUsages: KeyUsage[],
) => {
  return msrCrypto.subtle.sign(
    format,
    wrappedKey,
    unwrappingKey,
    unwrapAlgorithm,
    unwrappedKeyAlgorithm,
    extractable,
    keyUsages,
  );
};

const verify = async (
  algorithm: AlgorithmIdentifier | RsaPssParams | EcdsaParams,
  key: CryptoKey,
  signature: BufferSource,
  data: BufferSource,
) => {
  return msrCrypto.subtle.verify(algorithm, key, signature, data);
};

const wrapKey = async (
  format: KeyFormat,
  key: CryptoKey,
  wrappingKey: CryptoKey,
  wrapAlgorithm: AlgorithmIdentifier | RsaOaepParams | AesCtrParams | AesCbcParams | AesGcmParams,
) => {
  return msrCrypto.subtle.wrapKey(format, key, wrappingKey, wrapAlgorithm);
};

const randomUUID = () => {
  return uuidv4();
};

const crypto: Crypto = {
  getRandomValues: global.crypto.getRandomValues,
  subtle: {
    decrypt: decrypt,
    deriveBits: deriveBits,
    deriveKey: deriveKey,
    digest: digest,
    encrypt: encrypt,
    exportKey: exportKey,
    generateKey: generateKey,
    importKey: importKey,
    sign: sign,
    unwrapKey: unwrapKey,
    verify: verify,
    wrapKey: wrapKey,
  } as SubtleCrypto,
  randomUUID: randomUUID,
};

export default {
  ...crypto,
};
