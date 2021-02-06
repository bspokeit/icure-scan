import * as SecureStore from 'expo-secure-store';
import { initCrypto } from '../../api/icure';
import { ActionMap } from '../../models';

export enum SystemCheckStatus {
  Unknown = 'UNKNOWN',
  Ready = 'READY',
  Error = 'ERROR',
}

export enum SystemCheckType {
  CryptoSupport = 'CRYPTO_SUPPORT',
  StorageSupport = 'STORAGE_SUPPORT',
}
export interface SystemCheck {
  type: SystemCheckType;
  status: SystemCheckStatus;
  check: () => Promise<SystemCheckStatus>;
  errorMessage: string;
}
export interface SystemState {
  systemChecks: SystemCheck[];
  checkCompleted: boolean;
}

export enum SystemActionTypes {
  UpdateSystemCheck = 'UPDATE_SYSTEM_CHECK',
  SetCheckCompleted = 'SET_CHECK_COMPLETED',
}

export type SystemActionPayloadTypes = {
  [SystemActionTypes.UpdateSystemCheck]: SystemCheck;
  [SystemActionTypes.SetCheckCompleted]: boolean;
};

export type SystemAction = ActionMap<SystemActionPayloadTypes>[keyof ActionMap<SystemActionPayloadTypes>];

export const defaultSystemChecks: SystemCheck[] = [
  {
    type: SystemCheckType.CryptoSupport,
    status: SystemCheckStatus.Unknown,
    check: async (): Promise<SystemCheckStatus> => {
      let status;

      try {
        status = (await initCrypto())
          ? SystemCheckStatus.Ready
          : SystemCheckStatus.Error;
      } catch (err) {
        status = SystemCheckStatus.Error;
      }

      return status;
    },
    errorMessage: 'No Crypto support available',
  },
  {
    type: SystemCheckType.StorageSupport,
    status: SystemCheckStatus.Unknown,
    check: async (): Promise<SystemCheckStatus> => {
      let status;

      try {
        status = (await SecureStore.isAvailableAsync())
          ? SystemCheckStatus.Ready
          : SystemCheckStatus.Error;
      } catch (err) {
        status = SystemCheckStatus.Error;
      }

      return status;
    },
    errorMessage: 'No Secure Storage support available',
  },
];
