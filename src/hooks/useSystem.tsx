import * as SecureStore from 'expo-secure-store';
import { useContext } from 'react';
import { initCrypto as initApiCrypto } from '../api/icure';
import { Context as SystemContext } from '../context/SystemContext';

export default () => {
  const {
    setCryptoReady,
    setStoreReady,
    setSystemChecked,
    setError,
  } = useContext(SystemContext);

  const initCrypto = async () => {
    try {
      const cryptoSecured = await initApiCrypto();
      setCryptoReady(cryptoSecured);
    } catch (err) {
      console.error(err);
      setError('Unable to init crypto!');
    }
  };

  const checkSecureStore = async () => {
    try {
      const storeReady = await SecureStore.isAvailableAsync();
      setStoreReady(storeReady);
    } catch (err) {
      console.error(err);
      setError('Unable to access secure store!');
    }
  };

  const checkSystem = async () => {
    try {
      await Promise.all([initCrypto(), checkSecureStore()]);
    } catch (err) {
      console.error(err);
      setError('Unable to check the system!');
    }

    setSystemChecked(true);
  };

  return { checkSystem };
};
