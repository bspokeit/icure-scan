import isoCrypto from 'isomorphic-webcrypto';
import { Api } from '@icure/api';

const host = 'http://f5a0cc119943.ngrok.io/rest/v1';

export const initCrypto = async () => {
  await isoCrypto.ensureSecure();
};

//  TODO: provide credential up front
export const initICureApi = async () => {
  // if (iCureAPI.api) {
  //   return;
  // }

  await isoCrypto.ensureSecure();

  // iCureAPI.api = Api(host, 'demo-test-1608210888', 'test', isoCrypto);
};

const iCureAPI = {
  initCrypto,
};

export default iCureAPI;
