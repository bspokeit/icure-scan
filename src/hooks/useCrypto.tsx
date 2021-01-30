import * as SecureStore from 'expo-secure-store';
import * as _ from 'lodash';
import { useContext } from 'react';
import { getApi as api } from '../api/icure';
import { PRIVATE_KEY_POSTFIX_1, PRIVATE_KEY_POSTFIX_2 } from '../constant';
import { Context as CryptoContext } from '../context/CryptoContext';
import { HealthcareParty } from '../models';

export default () => {
  const { setKeyImport, setKey, deleteKey } = useContext(CryptoContext);

  const addPrivateKeyToStorage = async (
    hcp: HealthcareParty,
    content: string
  ): Promise<void> => {
    if (!hcp || !hcp.id || !content) {
      return;
    }

    const splitPosition = Math.floor(content.length / 2);
    const part1 = content.substr(0, splitPosition);
    const part2 = content.substr(splitPosition);

    await SecureStore.setItemAsync(`${hcp.id}${PRIVATE_KEY_POSTFIX_1}`, part1);
    await SecureStore.setItemAsync(`${hcp.id}${PRIVATE_KEY_POSTFIX_2}`, part2);
  };

  const getPrivateKeyFromStorage = async (
    hcp: HealthcareParty
  ): Promise<string | undefined> => {
    if (!hcp || !hcp.id) {
      return;
    }

    try {
      const part1 = await SecureStore.getItemAsync(
        `${hcp.id}${PRIVATE_KEY_POSTFIX_1}`
      );
      const part2 = await SecureStore.getItemAsync(
        `${hcp.id}${PRIVATE_KEY_POSTFIX_2}`
      );

      if (!part1 || !part2) {
        throw Error('No private key value found in storage');
      }

      return part1 + part2;
    } catch (error) {
      throw error;
    }
  };

  const removePrivateKeyFromStorage = async (
    hcp: HealthcareParty
  ): Promise<void> => {
    if (!hcp || !hcp.id) {
      return;
    }

    await SecureStore.deleteItemAsync(`${hcp.id}${PRIVATE_KEY_POSTFIX_1}`);
    await SecureStore.deleteItemAsync(`${hcp.id}${PRIVATE_KEY_POSTFIX_2}`);
  };

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

  const clearPrivateKeyData = async (hcp: HealthcareParty): Promise<void> => {
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

    setKeyImport(hcp.id, true);
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

  return { importPrivateKey, importPrivateKeysFromStorage };
};
