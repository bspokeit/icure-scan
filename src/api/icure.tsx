const isoCrypto = require('./support/msrCrypto');
const b64 = require('b64-lite');

global.atob = typeof atob === 'undefined' ? b64.atob : atob;
global.btoa = typeof btoa === 'undefined' ? b64.btoa : btoa;

const initSecuredCrypto = (): Promise<boolean> => {
  return require('expo-random')
    .getRandomBytesAsync(48)
    .then((byteArray: any[]) => {
      isoCrypto.initPrng(Array.from(byteArray));
      return true;
    })
    .catch(() => false);
};

import {
  IccAuthApi,
  IccCalendarItemXApi,
  IccClassificationXApi,
  IccContactXApi,
  IccCryptoXApi,
  IccDocumentXApi,
  IccEntityrefApi,
  IccFormXApi,
  IccHcpartyXApi,
  IccHelementXApi,
  IccInvoiceXApi,
  IccPatientApi,
  IccPatientXApi,
  IccUserXApi,
  WebSession,
  XHR,
} from '@icure/api';
import { IccAccesslogXApi } from '@icure/api/dist/icc-x-api/icc-accesslog-x-api';

export type ErrorHandler = (err: XHR.XHRError) => never;

export type IccApiHeaders = Array<XHR.Header>;
interface IccApiErrorHandler {
  handleError: (err: XHR.XHRError) => never;
}

const defaultErrorHandler: ErrorHandler = (err: XHR.XHRError) => {
  throw err;
};

const setErrorHandler = <T extends IccApiErrorHandler>(
  instance: T,
  handler: ErrorHandler = defaultErrorHandler
): T => {
  instance['handleError'] = handler;
  return instance;
};

export interface Credentials extends WebSession {
  username: string;
  password: string;
}

const BASE_URL: string = 'http://10.0.2.2:16043';

const API_URL: string = `${BASE_URL}/rest/v1`;

export const initCrypto = async (): Promise<boolean> => {
  try {
    await initSecuredCrypto();
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

let authAPI: IccAuthApi;
let userAPI: IccUserXApi;
let api: IcureAPI;

export const getAuthAPI = (): IccAuthApi => {
  if (!authAPI) {
    authAPI = new IccAuthApi(API_URL, {});
  }

  return authAPI;
};

export const getUserAPI = (): IccUserXApi => {
  if (!userAPI) {
    userAPI = new IccUserXApi(API_URL, {});
  }

  return userAPI;
};

export interface IcureAPI {
  authApi: IccAuthApi;
  userApi: IccUserXApi;
  healthcarePartyApi: IccHcpartyXApi;
  cryptoApi: IccCryptoXApi;
  accessLogApi: IccAccesslogXApi;
  contactApi: IccContactXApi;
  documentApi: IccDocumentXApi;
  patientApi: IccPatientXApi;
}

const buildApi = (
  headers?: IccApiHeaders,
  handler?: ErrorHandler
): IcureAPI => {
  const parsedHeaders = headers || {};

  const authApi = setErrorHandler(
    new IccAuthApi(API_URL, parsedHeaders),
    handler
  );

  const userApi = setErrorHandler(
    new IccUserXApi(API_URL, parsedHeaders),
    handler
  );

  const hcpPartyXApi = setErrorHandler(
    new IccHcpartyXApi(API_URL, parsedHeaders),
    handler
  );

  const cryptoApi = new IccCryptoXApi(
    API_URL,
    parsedHeaders,
    hcpPartyXApi,
    setErrorHandler(new IccPatientApi(API_URL, parsedHeaders), handler),
    isoCrypto as Crypto
  );

  const accessLogApi = setErrorHandler(
    new IccAccesslogXApi(API_URL, parsedHeaders, cryptoApi),
    handler
  );

  const contactApi = setErrorHandler(
    new IccContactXApi(API_URL, parsedHeaders, cryptoApi),
    handler
  );

  const documentApi = setErrorHandler(
    new IccDocumentXApi(API_URL, parsedHeaders, cryptoApi, authApi),
    handler
  );

  const formApi = new IccFormXApi(API_URL, parsedHeaders, cryptoApi);

  const helementApi = new IccHelementXApi(API_URL, parsedHeaders, cryptoApi);

  const entityRefApi = setErrorHandler(
    new IccEntityrefApi(API_URL, parsedHeaders)
  );

  const invoiceApi = setErrorHandler(
    new IccInvoiceXApi(API_URL, parsedHeaders, cryptoApi, entityRefApi),
    handler
  );

  const classificationApi = setErrorHandler(
    new IccClassificationXApi(API_URL, parsedHeaders, cryptoApi),
    handler
  );

  const calendarApi = setErrorHandler(
    new IccCalendarItemXApi(API_URL, parsedHeaders, cryptoApi),
    handler
  );

  const patientApi = setErrorHandler(
    new IccPatientXApi(
      API_URL,
      parsedHeaders,
      cryptoApi,
      contactApi,
      formApi,
      helementApi,
      invoiceApi,
      documentApi,
      hcpPartyXApi,
      classificationApi,
      calendarApi,
      ['note']
    )
  );

  return {
    authApi: authApi,
    userApi: userApi,
    healthcarePartyApi: hcpPartyXApi,
    cryptoApi: cryptoApi,
    accessLogApi: accessLogApi,
    contactApi: contactApi,
    documentApi: documentApi,
    patientApi: patientApi,
  };
};

export const init = (headers?: IccApiHeaders, handler?: ErrorHandler): void => {
  api = buildApi(headers, handler);
};

export const getAPI = (): IcureAPI => {
  if (!api) {
    throw Error(
      'No iCure Api has been instanciated yet.... Please, make sure you invoked initApi with valid credentials.'
    );
  }
  return api;
};

export default {
  initCrypto,
  init,
  getAuthAPI,
  getUserAPI,
  getAPI,
};
