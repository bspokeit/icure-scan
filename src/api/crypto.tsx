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

import { b64_2ab, b64_2ua, string2ab, ua2b64, ua2string } from '@icure/api/dist/icc-x-api/utils/binary-utils';
import { RNIcureAES, RNIcureRSA } from 'react-native-icure-crypto';
import { stringifyPrivateJWK, stringifyPublicJWK } from './key-helper';

import { v4 as uuidv4 } from 'uuid';

const msrCrypto = require('./support/msr-crypto.js');

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

const decrypt = async (algorithm: RsaOaepParams | AesCbcParams, key: CryptoKey, data: BufferSource) => {
  try {
    if (algorithm.name === 'RSA-OAEP') {
      const privateKey = stringifyPrivateJWK((await exportKey('jwk', key)) as JsonWebKey);
      const toDecrypt = ua2b64(data as ArrayBuffer);
      const decrypted = await RNIcureRSA.decrypt(toDecrypt, privateKey);
      if (!!decrypted) {
        return string2ab(decrypted);
      }
    }

    if (algorithm.name === 'AES-CBC') {
      const aesKey = ua2b64((await exportKey('raw', key)) as ArrayBuffer);
      const toDecrypt = ua2b64(data as ArrayBuffer);
      const iv = ua2b64((algorithm as AesCbcParams).iv as ArrayBuffer);
      const decrypted = await RNIcureAES.decrypt(toDecrypt, aesKey, iv);
      if (!!decrypted) {
        return b64_2ua(decrypted);
      }
    }
  } catch (error) {
    console.error(error);
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

const encrypt = async (algorithm: RsaOaepParams | AesCtrParams | AesCbcParams, key: CryptoKey, data: BufferSource) => {
  try {
    if (algorithm.name === 'RSA-OAEP') {
      const publicKey = stringifyPublicJWK((await exportKey('jwk', key)) as JsonWebKey);
      const toEncrypt = ua2string(data as ArrayBuffer);
      const encrypted = await RNIcureRSA.encrypt(toEncrypt, publicKey);

      if (!!encrypted) {
        return b64_2ab(encrypted);
      }
    }

    if (algorithm.name === 'AES-CBC') {
      const aesKey = ua2b64((await exportKey('raw', key)) as ArrayBuffer);
      const toEncrypt = ua2b64(data as ArrayBuffer);
      const iv = ua2b64((algorithm as AesCbcParams).iv as ArrayBuffer);
      const encrypted = await RNIcureAES.encrypt(toEncrypt, aesKey, iv);
      if (!!encrypted) {
        return b64_2ua(encrypted);
      }
    }
  } catch (error) {
    console.error(error);
  }

  return msrCrypto.subtle.encrypt(algorithm, key, data);
};

const exportKey = (format: 'jwk' | 'raw', key: CryptoKey): Promise<JsonWebKey | ArrayBuffer> => {
  return msrCrypto.subtle.exportKey(format, key);
};

const generateKey = async (
  algorithm: RsaOaepParams | AesCbcParams,
  extractable: boolean,
  keyUsages: ReadonlyArray<KeyUsage>,
): Promise<CryptoKeyPair | CryptoKey> => {
  if (algorithm.name === 'RSA-OAEP') {
  }

  if (algorithm.name === 'AES-CBC') {
  }

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
