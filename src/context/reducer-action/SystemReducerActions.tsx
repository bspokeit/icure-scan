import { ActionMap } from '../../models';

export interface SystemState {
  cryptoReady: boolean;
  storeReady: boolean;
  systemReady: boolean;
  checkCompleted: boolean;
  error: string;
}

export enum SystemActionTypes {
  SetCryptoReady = 'SET_CRYPTO_READY',
  SetSecureStoreAvailable = 'SET_SECURE_STORE_AVAILABLE',
  SetCheckCompleted = 'SET_CHECK_COMPLETED',
  SetError = 'SET_ERROR',
}

export type SystemActionPayloadTypes = {
  [SystemActionTypes.SetCryptoReady]: boolean;
  [SystemActionTypes.SetSecureStoreAvailable]: boolean;
  [SystemActionTypes.SetCheckCompleted]: undefined;
  [SystemActionTypes.SetError]: string;
};

export type SystemAction = ActionMap<SystemActionPayloadTypes>[keyof ActionMap<SystemActionPayloadTypes>];
