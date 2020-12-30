import createContext from './createContext';
import * as SecureStore from 'expo-secure-store';
import { compact } from 'lodash';

const PRIVATE_KEY_POSTFIX_1 = '-icure-scan-key-1';
const PRIVATE_KEY_POSTFIX_2 = '-icure-scan-key-2';

const cryptoReducer = (state, action) => {
  switch (action.type) {
    case 'private_key':
      return { ...state, keys: { ...state.keys, ...action.payload } };
    default:
      return state;
  }
};

const storePrivateKey = async (hcp, content) => {
  if (!hcp || !hcp.id || !content) {
    return;
  }

  const splitPosition = Math.floor(content.length / 2);
  const part1 = content.substr(0, splitPosition);
  const part2 = content.substr(splitPosition);

  await SecureStore.setItemAsync(`${hcp.id}${PRIVATE_KEY_POSTFIX_1}`, part1);
  await SecureStore.setItemAsync(`${hcp.id}${PRIVATE_KEY_POSTFIX_2}`, part2);
};

const getPrivateKey = async (hcp) => {
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

const loadPrivateKeyFromStorage = (dispatch) => async (hcp) => {
  const privateKey = await getPrivateKey(hcp);
  dispatch({
    type: 'private_key',
    payload: { [hcp.id]: privateKey },
  });
};

const loadPrivateKeyToStorage = (dispatch) => async (hcp, privateKey) => {
  await storePrivateKey(hcp, privateKey);
  dispatch({
    type: 'private_key',
    payload: { [hcp.id]: privateKey },
  });
};

const loadPrivateKeysFromStorage = (dispatch) => async (hcps) => {
  if (!hcps || !hcps.length) {
    return;
  }

  const chainedPromise = Promise.resolve();
  return compact(hcps).reduce((acc, current) => {
    acc = acc.then(() => {
      return loadPrivateKeyFromStorage(dispatch)(current);
    });
    return acc;
  }, chainedPromise);
};

export const { Provider, Context } = createContext(
  cryptoReducer,
  {
    loadPrivateKeyToStorage,
    loadPrivateKeyFromStorage,
    loadPrivateKeysFromStorage,
  },
  { keys: {} }
);
