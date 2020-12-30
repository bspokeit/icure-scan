import * as SecureStore from 'expo-secure-store';
import { compact } from 'lodash';
import iCureAPI from '../api/icure';
import createContext from './createContext';

const PRIVATE_KEY_POSTFIX_1 = '-icure-scan-key-1';
const PRIVATE_KEY_POSTFIX_2 = '-icure-scan-key-2';

const cryptoReducer = (state, action) => {
  switch (action.type) {
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
  const part1 = await SecureStore.getItemAsync(
    `${hcp.id}${PRIVATE_KEY_POSTFIX_1}`
  );
  const part2 = await SecureStore.getItemAsync(
    `${hcp.id}${PRIVATE_KEY_POSTFIX_2}`
  );

  return part1 + part2;
};

const removePrivateKeyFromStorage = async (hcp) => {
  if (!hcp || !hcp.id) {
    return;
  }

  await SecureStore.deleteItemAsync(`${hcp.id}${PRIVATE_KEY_POSTFIX_1}`);
  await SecureStore.deleteItemAsync(`${hcp.id}${PRIVATE_KEY_POSTFIX_2}`);
};

const importAndValidatePrivateKey = async (hcp, privateKey) => {
  return iCureAPI
    .getCryptoAPI()
    .loadKeyPairsAsTextInBrowserLocalStorage(
      hcp.id,
      iCureAPI.getCryptoAPI().utils.hex2ua(privateKey)
    )
    .then(() => {
      console.log('Imported: ', hcp.id, privateKey.substr(-25));
    })
    .then(() => true)
    .catch((err) => {
      console.log(err);
      return false;
    });
};

const importPrivateKeyFromStorage = (dispatch) => async (hcp) => {
  try {
    const privateKey = await getPrivateKeyFromStorage(hcp);
    await importAndValidatePrivateKey(hcp, privateKey);
    dispatch({
      type: 'add_private_key',
      payload: { [hcp.id]: privateKey },
    });
  } catch (err) {
    console.log(err);
    clearPrivateKeyData(dispatch)(hcp);
  }
};

const importPrivateKey = (dispatch) => async (hcp, privateKey) => {
  try {
    await importAndValidatePrivateKey(hcp, privateKey);
    await addPrivateKeyToStorage(hcp, privateKey);
    dispatch({
      type: 'add_private_key',
      payload: { [hcp.id]: privateKey },
    });
  } catch (err) {
    console.log(err);
    clearPrivateKeyData(dispatch)(hcp);
  }
};

const importPrivateKeysFromStorage = (dispatch) => async (hcps) => {
  if (!hcps || !hcps.length) {
    return;
  }

  const chainedPromise = Promise.resolve();
  return compact(hcps).reduce((acc, current) => {
    acc = acc.then(() => {
      return importPrivateKeyFromStorage(dispatch)(current);
    });
    return acc;
  }, chainedPromise);
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
    importPrivateKeyFromStorage,
    importPrivateKeysFromStorage,
  },
  { keys: {} }
);
