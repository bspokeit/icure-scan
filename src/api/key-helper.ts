import { UtilsClass } from '@icure/api/dist/icc-x-api/crypto/utils';
import { hex2ua, ua2b64 } from '@icure/api/dist/icc-x-api/utils/binary-utils';

const cryptoUtils = new UtilsClass();

export const KEY_TAGS = ['PUBLIC', 'PRIVATE', 'RSA PUBLIC', 'RSA PRIVATE'];

export const removeHeaders = (key: string): string => {
  let copy = key.slice();
  for (let tag in KEY_TAGS) {
    copy.replace(`-----BEGIN ${tag} KEY-----`, '');
  }

  return copy;
};

export const removeFooters = (key: string): string => {
  let copy = key.slice();
  for (let tag in KEY_TAGS) {
    copy.replace(`-----END ${tag} KEY-----`, '');
  }

  return copy;
};

export const removeCarriage = (key: string): string => {
  let copy = key.slice();
  copy.replace(/\n/g, '');
  return copy;
};

export const cleanKey = (key: string): string => {
  let copy = key.slice();
  copy = removeHeaders(copy);
  copy = removeFooters(copy);
  copy = removeCarriage(copy);
  return copy;
};

export const stringifyPublicJWK = (jwk: JsonWebKey): string => {
  return ua2b64(hex2ua(cryptoUtils.jwk2spki(jwk)));
};

export const stringifyPrivateJWK = (jwk: JsonWebKey): string => {
  return ua2b64(hex2ua(cryptoUtils.jwk2pkcs1(jwk)));
};
