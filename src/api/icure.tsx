const isoCrypto = require('isomorphic-webcrypto');
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

export interface Credentials extends WebSession {
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

export const getAuthAPI = (): IccAuthApi => {
  if (!authAPI) {
    authAPI = new IccAuthApi(API_URL, {});
  }

  return authAPI;
};

const buildApi = (
  headers?: IccApiHeaders,
  handler?: ErrorHandler
): IcureAPI => {
  const parsedHeaders = headers || {};

  const authApi = setErrorHandler(
    new IccAuthApi(API_URL, parsedHeaders),
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
    isoCrypto
  );
  const contactApi = setErrorHandler(
    new IccContactXApi(API_URL, parsedHeaders, cryptoApi),
    handler
  );
  const documentApi = setErrorHandler(
    new IccDocumentXApi(API_URL, parsedHeaders, cryptoApi, authApi),
    handler
  );

  return {
    authApi: setErrorHandler(new IccAuthApi(API_URL, parsedHeaders), handler),
    userApi: setErrorHandler(new IccUserXApi(API_URL, parsedHeaders), handler),
    healthcarePartyApi: hcpPartyXApi,
    cryptoApi: cryptoApi,
    accessLogApi: setErrorHandler(
      new IccAccesslogXApi(API_URL, parsedHeaders, cryptoApi),
      handler
    ),
    contactApi: contactApi,
    documentApi: documentApi,

    patientApi: setErrorHandler(
      new IccPatientXApi(
        API_URL,
        parsedHeaders,
        cryptoApi,
        contactApi,
        setErrorHandler(
          new IccFormXApi(API_URL, parsedHeaders, cryptoApi),
          handler
        ),
        setErrorHandler(
          new IccHelementXApi(API_URL, parsedHeaders, cryptoApi),
          handler
        ),
        setErrorHandler(
          new IccInvoiceXApi(
            API_URL,
            parsedHeaders,
            cryptoApi,
            setErrorHandler(new IccEntityrefApi(API_URL, parsedHeaders))
          ),
          handler
        ),
        documentApi,
        hcpPartyXApi,
        setErrorHandler(
          new IccClassificationXApi(API_URL, parsedHeaders, cryptoApi),
          handler
        ),
        setErrorHandler(
          new IccCalendarItemXApi(API_URL, parsedHeaders, cryptoApi),
          handler
        ),
        ['note']
      )
    ),
  };
};

export const init = (headers?: IccApiHeaders, handler?: ErrorHandler): void => {
  api = buildApi(headers, handler);
};

export const configure = (headers?: IccApiHeaders, handler?: ErrorHandler) => {
  if (api) {
    api = buildApi(headers, handler);
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
  init,
  configure,
  getAuthAPI,
  getApi,
};
