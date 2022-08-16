import { UtilsClass } from '@icure/api/dist/icc-x-api/crypto/utils';
import { hex2ua, ua2b64 } from '@icure/api/dist/icc-x-api/utils/binary-utils';

const cryptoUtils = new UtilsClass();

export const stringifyPublicJWK = (jwk: JsonWebKey): string => {
  return ua2b64(hex2ua(cryptoUtils.jwk2spki(jwk)));
};

export const stringifyPrivateJWK = (jwk: JsonWebKey): string => {
  return ua2b64(hex2ua(cryptoUtils.jwk2pkcs1(jwk)));
};
