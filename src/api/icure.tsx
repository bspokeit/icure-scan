const isoCrypto = require('isomorphic-webcrypto');
import {
  Api,
  IccAuthApi,
  IccContactXApi,
  IccCryptoXApi,
  IccDocumentXApi,
  IccHcpartyXApi,
  IccPatientXApi,
  IccUserXApi,
  XHR,
} from '@icure/api';
import { IccAccesslogXApi } from '@icure/api/dist/icc-x-api/icc-accesslog-x-api';

export interface IcureAPI {
  cryptoApi: IccCryptoXApi;
  userApi: IccUserXApi;
  patientApi: IccPatientXApi;
  healthcarePartyApi: IccHcpartyXApi;
  accessLogApi: IccAccesslogXApi;
  contactApi: IccContactXApi;
  documentApi: IccDocumentXApi;
}

export interface Credentials {
  username: string;
  password: string;
}

const BASE_URL: string = 'http://10.0.2.2:16043';

const API_URL: string = `${BASE_URL}/rest/v1`;

export const initCrypto = async (): Promise<boolean> => {
  try {
    await isoCrypto.ensureSecure();
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

let authAPI: IccAuthApi;
let api: IcureAPI;

export const getAuthAPI = (headers: Array<XHR.Header>): IccAuthApi => {
  if (!authAPI) {
    authAPI = new IccAuthApi(API_URL, { ...headers });
  }

  return authAPI;
};

export const initApi = ({ username, password }: Credentials): void => {
  if (!api) {
    api = Api(API_URL, username, password, isoCrypto);
  }
};

export const getApi = (): IcureAPI => {
  if (!api) {
    throw Error(
      'No iCure Api has been instanciated yet.... Please, make sure you invoked initApi with valid credentials.'
    );
  }
  return api;
};

export default {
  initCrypto,
  initApi,
  getAuthAPI,
  getApi,
};
