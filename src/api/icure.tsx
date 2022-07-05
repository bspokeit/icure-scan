/*
 * Copyright (C) 2022 Bspoke IT SRL
 *
 * This file is part of icure-scan.
 *
 * icure-scan is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * icure-scan is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with icure-scan.  If not, see <http://www.gnu.org/licenses/>.
 */
import crypto from './crypto';
const b64 = require('b64-lite');

global.atob = typeof atob === 'undefined' ? b64.atob : atob;
global.btoa = typeof btoa === 'undefined' ? b64.btoa : btoa;

const initSecuredCrypto = async (): Promise<boolean> => {
  // Only needed for crypto.getRandomValues
  // but only wait once, future calls are secure
  // return await isoCrypto.ensureSecure();
  return true;
};

import {
  IccAuthApi,
  IccCalendarItemXApi,
  IccClassificationXApi,
  IccContactXApi,
  IccCryptoXApi,
  IccDeviceApi,
  IccDocumentXApi,
  IccEntityrefApi,
  IccFormXApi,
  IccHcpartyXApi,
  IccHelementXApi,
  IccInvoiceXApi,
  IccPatientApi,
  IccPatientXApi,
  IccUserXApi,
  // WebSession,
  XHR
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
  handler: ErrorHandler = defaultErrorHandler,
): T => {
  instance['handleError'] = handler;
  return instance;
};

export interface Credentials {
  //extends WebSession {
  username: string;
  password: string;
}

//  const BASE_URL: string = 'http://10.0.2.2:16043';
//  const BASE_URL: string = 'http://localhost:16043';
const BASE_URL: string = 'http://192.168.249.62:16043';

const API_URL: string = `${BASE_URL}/rest/v1`;

export const initCrypto = async (): Promise<boolean> => {
  try {
    return await initSecuredCrypto();
    //return !!window.crypto && !isEmpty(window.crypto)
  } catch (error) {
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
  handler?: ErrorHandler,
): IcureAPI => {
  //const parsedHeaders = headers || {};
  const parsedHeaders = {
    authorization: 'Basic ZGVtby10ZXN0LTE2MDgyMTA4ODg6dGVzdA==',
  };
  const authApi = setErrorHandler(
    new IccAuthApi(API_URL, parsedHeaders),
    handler,
  );

  const userApi = setErrorHandler(
    new IccUserXApi(API_URL, parsedHeaders),
    handler,
  );

  const hcpPartyXApi = setErrorHandler(
    new IccHcpartyXApi(API_URL, parsedHeaders),
    handler,
  );

  const deviceApi = setErrorHandler(
    new IccDeviceApi(API_URL, parsedHeaders),
    handler,
  );

  const cryptoApi = new IccCryptoXApi(
    API_URL,
    parsedHeaders,
    hcpPartyXApi,
    setErrorHandler(new IccPatientApi(API_URL, parsedHeaders), handler),
    deviceApi,
    crypto,
  );

  const accessLogApi = setErrorHandler(
    new IccAccesslogXApi(API_URL, parsedHeaders, cryptoApi, userApi),
    handler,
  );

  const contactApi = setErrorHandler(
    new IccContactXApi(API_URL, parsedHeaders, cryptoApi, userApi),
    handler,
  );

  const documentApi = setErrorHandler(
    new IccDocumentXApi(API_URL, parsedHeaders, cryptoApi, authApi, userApi),
    handler,
  );

  const formApi = new IccFormXApi(API_URL, parsedHeaders, cryptoApi, userApi);

  const helementApi = new IccHelementXApi(
    API_URL,
    parsedHeaders,
    cryptoApi,
    userApi,
  );

  const entityRefApi = setErrorHandler(
    new IccEntityrefApi(API_URL, parsedHeaders),
  );

  const invoiceApi = setErrorHandler(
    new IccInvoiceXApi(
      API_URL,
      parsedHeaders,
      cryptoApi,
      entityRefApi,
      userApi,
    ),
    handler,
  );

  const classificationApi = setErrorHandler(
    new IccClassificationXApi(API_URL, parsedHeaders, cryptoApi, userApi),
    handler,
  );

  const calendarApi = setErrorHandler(
    new IccCalendarItemXApi(API_URL, parsedHeaders, cryptoApi, userApi),
    handler,
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
      userApi,
      calendarApi,
      ['note'],
    ),
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
      'No iCure Api has been instanciated yet.... Please, make sure you invoked initApi with valid credentials.',
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
