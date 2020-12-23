import isoCrypto from 'isomorphic-webcrypto';
import { Api, IccAuthApi } from '@icure/api';

const BASE_URL = 'http://cc145e8e3c89.ngrok.io';

const API_URL = `${BASE_URL}/rest/v1`;

const HEADERS = {
  'X-CLIENT-SIDE-TIMEOUT': 30000,
};

export const initCrypto = async () => {
  await isoCrypto.ensureSecure();
};

//  TODO: provide credential up front
// export const initICureApi = async () => {
//   // if (iCureAPI.api) {
//   //   return;
//   // }

//   await isoCrypto.ensureSecure();

//   // iCureAPI.api = Api(host, 'demo-test-1608210888', 'test', isoCrypto);
// };

const authAPI = new IccAuthApi(API_URL, HEADERS);

const iCureAPI = {
  initCrypto,
  authAPI,
};

export default iCureAPI;
