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

import { hex2ua } from '@icure/api/dist/icc-x-api/utils/binary-utils';
import _ from 'lodash';
import { useContext } from 'react';
import { getAPI as api } from '../api/icure';
import { Context as CryptoContext } from '../context/CryptoContext';
import { HealthcareParty } from '../models';
import useStorage from './useStorage';

export default () => {
  const {setKeyImport, setKey, deleteKey} = useContext(CryptoContext);

  const {
    addPrivateKeyToStorage,
    getPrivateKeyFromStorage,
    removePrivateKeyFromStorage,
  } = useStorage();

  const validatePrivateKey = async (hcp: HealthcareParty): Promise<boolean> => {
    return await api().cryptoApi.checkPrivateKeyValidity(hcp);
  };

  const importAndValidatePrivateKey = async (
    hcp: HealthcareParty,
    privateKey: string,
  ): Promise<boolean> => {
    return api()
      .cryptoApi.loadKeyPairsAsTextInBrowserLocalStorage(
        hcp.id,
        hex2ua(privateKey),
      )
      .then(() => {
        console.log('Hello !');
        return validatePrivateKey(hcp);
      })
      .catch(error => {
        console.error(error);
        return false;
      });
  };

  const clearPrivateKeyData = async (
    hcp: HealthcareParty | undefined,
  ): Promise<void> => {
    if (!hcp) {
      return;
    }
    await removePrivateKeyFromStorage(hcp);
    deleteKey(hcp.id);
  };

  const importPrivateKeyFromStorage = async (
    hcp: HealthcareParty,
  ): Promise<void> => {
    setKeyImport(hcp.id, true);

    try {
      const privateKey = await getPrivateKeyFromStorage(hcp);

      if (!privateKey) {
        throw new Error('No private key found in storage!');
      }

      const keyImported = await importAndValidatePrivateKey(hcp, privateKey);

      if (keyImported) {
        setKey(hcp.id, privateKey);
      } else {
        await clearPrivateKeyData(hcp);
      }
    } catch (err) {
      await clearPrivateKeyData(hcp);
    }
    setKeyImport(hcp.id, false);
  };

  const importPrivateKey = async (
    hcp: HealthcareParty,
    privateKey: string,
  ): Promise<void> => {
    setKeyImport(hcp.id, true);

    try {
      const keyImported = await importAndValidatePrivateKey(hcp, privateKey);

      if (keyImported) {
        await addPrivateKeyToStorage(hcp, privateKey);
        setKey(hcp.id, privateKey);
      } else {
        await clearPrivateKeyData(hcp);
      }
    } catch (error) {
      console.error(error);
      await clearPrivateKeyData(hcp);
    }

    setKeyImport(hcp.id, false);
  };

  const importPrivateKeysFromStorage = async (hcps: Array<HealthcareParty>) => {
    _.forEach(hcps, hcp => {
      setKeyImport(hcp.id, true);
    });

    return _.reduce(
      hcps,
      (acc, hcp) => {
        acc = acc.then(() => {
          return importPrivateKeyFromStorage(hcp);
        });
        return acc;
      },
      Promise.resolve(),
    );
  };

  return {
    importPrivateKey,
    importPrivateKeysFromStorage,
    clearPrivateKeyData,
  };
};
