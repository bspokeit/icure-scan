import * as SecureStore from 'expo-secure-store';
import iCureAPI from '../api/icure';
import createContext from './createContext';

const systemReducer = (state, action) => {
  switch (action.type) {
    case 'crypto_ready':
      return { ...state, cryptoReady: action.payload };
    case 'secure_store_available':
      return { ...state, secureStoreAvailable: action.payload };
    case 'add_error':
      return { ...state, errorMessage: action.payload };
    default:
      return state;
  }
};

const checkSecureStore = (dispatch) => async () => {
  try {
    const secureStoreAvailable = await SecureStore.isAvailableAsync();
    console.log('secureStoreAvailable: ', secureStoreAvailable);
    dispatch({ type: 'secure_store_available', payload: secureStoreAvailable });
  } catch (err) {
    dispatch({ type: 'add_error', payload: err.message });
  }
};

const initCrypto = (dispatch) => async () => {
  try {
    const cryptoSecured = await iCureAPI.initCrypto();
    console.log('Crypto ready ? ', cryptoSecured);
    dispatch({ type: 'crypto_ready', payload: true });
  } catch (err) {
    dispatch({ type: 'add_error', payload: err.message });
  }
};

const checkSystem = (dispatch) => async () => {
  try {
    return await Promise.all([
      initCrypto(dispatch)(),
      checkSecureStore(dispatch)(),
    ]);
  } catch (err) {
    dispatch({ type: 'add_error', payload: err.message });
    throw err;
  }
};

export const { Provider, Context } = createContext(
  systemReducer,
  { checkSystem },
  { cryptoReady: false, secureStoreAvailable: false }
);
