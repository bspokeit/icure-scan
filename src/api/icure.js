const isoCrypto = require('isomorphic-webcrypto');

import { Api, IccAuthApi } from '@icure/api';

const BASE_URL = 'http://56a419f4217d.ngrok.io';

const API_URL = `${BASE_URL}/rest/v1`;

export const initCrypto = async () => {
  try {
    await isoCrypto.ensureSecure();
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

let authAPI;
let api;

export const getAuthAPI = (headers) => {
  if (!authAPI) {
    authAPI = new IccAuthApi(API_URL, { ...headers });
  }

  return authAPI;
};

export const initApi = ({ username, password }) => {
  if (!api) {
    api = Api(API_URL, username, password, isoCrypto);
  }
};

export const getApi = () => {
  if (!api) {
    throw Error(
      'No iCure Api has been instanciated yet.... Please, make sure you invoked initApi with valid credentials.'
    );
  }
  return api;
};

const iCureAPI = {
  initCrypto,
  initApi,
  getAuthAPI,
  getApi,
};

export default iCureAPI;
