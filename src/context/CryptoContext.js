import * as SecureStore from 'expo-secure-store';
import { compact } from 'lodash';
import { getApi as api } from '../api/icure';
import createContext from './createContext';

const PRIVATE_KEY_POSTFIX_1 = '-icure-scan-key-1';
const PRIVATE_KEY_POSTFIX_2 = '-icure-scan-key-2';

const cryptoReducer = (state, action) => {
  switch (action.type) {
    case 'set_private_key_import':
      const keyImports = { ...state.keyImports, ...action.payload };
      return { ...state, keyImports };
    case 'add_private_key':
      const extendedKeySet = { ...state.keys, ...action.payload };
      return { ...state, keys: extendedKeySet };
    case 'remove_private_key':
      const cleanedKeySet = { ...state.keys };
      delete cleanedKeySet[action.payload];
      return { ...state, keys: cleanedKeySet };
    default:
      return state;
  }
};

const addPrivateKeyToStorage = async (hcp, content) => {
  if (!hcp || !hcp.id || !content) {
    return;
  }

  const splitPosition = Math.floor(content.length / 2);
  const part1 = content.substr(0, splitPosition);
  const part2 = content.substr(splitPosition);

  await SecureStore.setItemAsync(`${hcp.id}${PRIVATE_KEY_POSTFIX_1}`, part1);
  await SecureStore.setItemAsync(`${hcp.id}${PRIVATE_KEY_POSTFIX_2}`, part2);
};

const getPrivateKeyFromStorage = async (hcp) => {
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

const removePrivateKeyFromStorage = async (hcp) => {
  if (!hcp || !hcp.id) {
    return;
  }

  await SecureStore.deleteItemAsync(`${hcp.id}${PRIVATE_KEY_POSTFIX_1}`);
  await SecureStore.deleteItemAsync(`${hcp.id}${PRIVATE_KEY_POSTFIX_2}`);
};

const validatePrivateKey = async (hcp) => {
  //  TODO: write this block with awaits
  const randomString = Math.random().toString(36).substring(2);

  let userCryptoKey = null;

  return api()
    .healthcarePartyApi.getHcPartyKeysForDelegate(hcp.id)
    .then((encryptedHcPartyKey) =>
      api().cryptoApi.decryptHcPartyKey(
        hcp.id,
        hcp.id,
        encryptedHcPartyKey[hcp.id],
        true
      )
    )
    .then((importedAESHcPartyKey) => {
      userCryptoKey = importedAESHcPartyKey.key;
      return api().cryptoApi.AES.encrypt(
        userCryptoKey,
        api().cryptoApi.utils.text2ua(randomString)
      );
    })
    .then((cryptedString) => {
      return api().cryptoApi.AES.decrypt(userCryptoKey, cryptedString);
    })
    .then((decription) => {
      return Promise.resolve(
        api().cryptoApi.utils.ua2text(decription) === randomString
      );
    })
    .catch((error) => {
      console.log(error);
      Promise.resolve(false);
    });
};

const importAndValidatePrivateKey = async (hcp, privateKey) => {
  return api()
    .cryptoApi.loadKeyPairsAsTextInBrowserLocalStorage(
      hcp.id,
      api().cryptoApi.utils.hex2ua(privateKey)
    )
    .then(() => {
      return validatePrivateKey(hcp);
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
};

const importPrivateKeyFromStorage = (dispatch) => async (hcp) => {
  dispatch({ type: 'set_private_key_import', payload: { [hcp.id]: true } });
  try {
    const privateKey = await getPrivateKeyFromStorage(hcp);
    const keyImported = await importAndValidatePrivateKey(hcp, privateKey);

    if (keyImported) {
      dispatch({
        type: 'add_private_key',
        payload: { [hcp.id]: privateKey },
      });
    } else {
      await clearPrivateKeyData(dispatch)(hcp);
    }
    dispatch({ type: 'set_private_key_import', payload: { [hcp.id]: false } });
  } catch (err) {
    await clearPrivateKeyData(dispatch)(hcp);
    dispatch({ type: 'set_private_key_import', payload: { [hcp.id]: false } });
  }
};

const importPrivateKey = (dispatch) => async (hcp, privateKey) => {
  dispatch({ type: 'set_private_key_import', payload: { [hcp.id]: true } });

  try {
    const keyImported = await importAndValidatePrivateKey(hcp, privateKey);

    if (keyImported) {
      await addPrivateKeyToStorage(hcp, privateKey);
      dispatch({
        type: 'add_private_key',
        payload: { [hcp.id]: privateKey },
      });
    } else {
      await clearPrivateKeyData(dispatch)(hcp);
    }
    dispatch({
      type: 'set_private_key_import',
      payload: { [hcp.id]: false },
    });
  } catch (err) {
    console.log(err);
    await clearPrivateKeyData(dispatch)(hcp);

    dispatch({
      type: 'set_private_key_import',
      payload: { [hcp.id]: false },
    });
  }
};

const importPrivateKeysFromStorage = (dispatch) => async (hcps) => {
  if (!hcps || !hcps.length) {
    return;
  }
  compact(hcps).forEach((hcp) => {
    dispatch({ type: 'set_private_key_import', payload: { [hcp.id]: true } });
  });

  const chainedPromise = Promise.resolve();

  compact(hcps).reduce((acc, current) => {
    acc = acc.then(() => {
      return importPrivateKeyFromStorage(dispatch)(current);
    });
    return acc;
  }, chainedPromise);

  return chainedPromise;
};

const clearPrivateKeyData = (dispatch) => async (hcp) => {
  await removePrivateKeyFromStorage(hcp);
  dispatch({
    type: 'remove_private_key',
    payload: hcp.id,
  });
};

export const { Provider, Context } = createContext(
  cryptoReducer,
  {
    importPrivateKey,
    importPrivateKeysFromStorage,
  },
  { keys: {}, keyImports: {} }
);
