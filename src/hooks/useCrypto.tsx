import * as _ from 'lodash';
import { useContext } from 'react';
import { getAPI as api } from '../api/icure';
import { Context as CryptoContext } from '../context/CryptoContext';
import { HealthcareParty } from '../models';
import useStorage from './useStorage';

export default () => {
  const { setKeyImport, setKey, deleteKey } = useContext(CryptoContext);

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
    privateKey: string
  ): Promise<boolean> => {
    return api()
      .cryptoApi.loadKeyPairsAsTextInBrowserLocalStorage(
        hcp.id,
        api().cryptoApi.utils.hex2ua(privateKey)
      )
      .then(() => {
        return validatePrivateKey(hcp);
      })
      .catch((error) => {
        console.error(error);
        return false;
      });
  };

  const clearPrivateKeyData = async (
    hcp: HealthcareParty | undefined
  ): Promise<void> => {
    if (!hcp) {
      return;
    }
    await removePrivateKeyFromStorage(hcp);
    deleteKey(hcp.id);
  };

  const importPrivateKeyFromStorage = async (
    hcp: HealthcareParty
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
    privateKey: string
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
    _.forEach(hcps, (hcp) => {
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
      Promise.resolve()
    );
  };

  return {
    importPrivateKey,
    importPrivateKeysFromStorage,
    clearPrivateKeyData,
  };
};
