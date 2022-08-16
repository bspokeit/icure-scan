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

import EncryptedStorage from 'react-native-encrypted-storage';
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
        status = (await initCrypto()) ? SystemCheckStatus.Ready : SystemCheckStatus.Error;
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
        await EncryptedStorage.setItem('test', 'create_read_delete');
        const check = (await EncryptedStorage.getItem('test')) === 'create_read_delete';
        await EncryptedStorage.removeItem('test');

        status = check ? SystemCheckStatus.Ready : SystemCheckStatus.Error;
      } catch (err) {
        console.log(err);
        status = SystemCheckStatus.Error;
      }

      return status;
    },
    errorMessage: 'No Secure Storage support available',
  },
];
