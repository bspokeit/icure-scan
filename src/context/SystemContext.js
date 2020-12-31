import * as SecureStore from 'expo-secure-store';
import { initCrypto as initApiCrypto } from '../api/icure';
import createContext from './createContext';

const systemReducer = (state, action) => {
  switch (action.type) {
    case 'crypto_ready':
      const cryptoReady = action.payload;
      return {
        ...state,
        cryptoReady,
        systemReady: state.secureStoreAvailable && cryptoReady,
      };
    case 'secure_store_available':
      const secureStoreAvailable = action.payload;
      return {
        ...state,
        secureStoreAvailable,
        systemReady: secureStoreAvailable && state.cryptoReady,
      };
    case 'add_error':
      return { ...state, errorMessage: action.payload };
    default:
      return state;
  }
};

const checkSecureStore = (dispatch) => async () => {
  try {
    const secureStoreAvailable = await SecureStore.isAvailableAsync();
    dispatch({ type: 'secure_store_available', payload: secureStoreAvailable });
  } catch (err) {
    dispatch({ type: 'add_error', payload: err.message });
  }
};

const initCrypto = (dispatch) => async () => {
  try {
    const cryptoSecured = await initApiCrypto();
    dispatch({ type: 'crypto_ready', payload: cryptoSecured });
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
  { cryptoReady: false, secureStoreAvailable: false, systemReady: false }
);
