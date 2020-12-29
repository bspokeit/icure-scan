const isoCrypto = require('isomorphic-webcrypto');
console.log('AAAAAAAAA');
import {
  IccAuthApi,
  IccHcpartyXApi,
  IccUserXApi,
  IccPatientApi,
  IccCryptoXApi,
} from '@icure/api';

const BASE_URL = 'http://41839e7eb8c4.ngrok.io';

const API_URL = `${BASE_URL}/rest/v1`;

const HEADERS = {
  'X-CLIENT-SIDE-TIMEOUT': 30000,
};

export const initCrypto = async () => {
  await isoCrypto.ensureSecure();
};

let authAPI;
let userAPI;
let hcpApi;
let patientApi;
let cryptoApi;

export const getAuthAPI = (headers) => {
  if (!authAPI) {
    authAPI = new IccAuthApi(API_URL, { ...HEADERS, ...headers });
  }

  return authAPI;
};

export const getUserAPI = (headers) => {
  if (!userAPI) {
    userAPI = new IccUserXApi(API_URL, { ...HEADERS, ...headers });
  }

  return userAPI;
};

export const getHcpAPI = (headers) => {
  if (!hcpApi) {
    hcpApi = new IccHcpartyXApi(API_URL, { ...HEADERS, ...headers });
  }

  return hcpApi;
};

export const getPatientAPI = (headers) => {
  if (!patientApi) {
    patientApi = new IccPatientApi(API_URL, { ...HEADERS, ...headers });
  }

  return patientApi;
};

export const getCryptoAPI = (headers) => {
  if (!cryptoApi) {
    cryptoApi = new IccCryptoXApi(
      API_URL,
      { ...HEADERS, ...headers },
      getHcpAPI(headers),
      new IccPatientApi(API_URL, headers),
      isoCrypto
    );
  }

  return cryptoApi;
};

export const addHeaders = (headers) => {
  authAPI = null;
  userAPI = null;
  hcpApi = null;
  patientApi = null;
  cryptoApi = null;

  getAuthAPI(headers);
  getUserAPI(headers);
  getHcpAPI(headers);
  getCryptoAPI(headers);
};

const iCureAPI = {
  initCrypto,
  addHeaders,
  getAuthAPI,
  getUserAPI,
  getHcpAPI,
  getCryptoAPI,
};

export default iCureAPI;
