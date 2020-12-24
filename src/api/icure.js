import isoCrypto from 'isomorphic-webcrypto';
import { Api, IccAuthApi, IccUserXApi } from '@icure/api';

const BASE_URL = 'http://1eab3ec0ebca.ngrok.io';

const API_URL = `${BASE_URL}/rest/v1`;

const HEADERS = {
  'X-CLIENT-SIDE-TIMEOUT': 30000,
};

export const initCrypto = async () => {
  await isoCrypto.ensureSecure();
};

const authAPI = new IccAuthApi(API_URL, HEADERS);
let userAPI;

export const getUserAPI = (headers) => {
  if (!userAPI) {
    return new IccUserXApi(API_URL, { ...HEADERS, ...headers });
  }

  return userAPI;
};

//  TODO: provide credential up front
// export const initICureApi = async () => {
//   // if (iCureAPI.api) {
//   //   return;
//   // }

//   await isoCrypto.ensureSecure();

//   // iCureAPI.api = Api(host, 'demo-test-1608210888', 'test', isoCrypto);
// };

const iCureAPI = {
  initCrypto,
  authAPI,
  getUserAPI,
};

export default iCureAPI;
