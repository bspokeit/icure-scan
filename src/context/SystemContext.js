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
        systemReady: state.storeReady && cryptoReady,
      };
    case 'secure_store_available':
      const storeReady = action.payload;
      return {
        ...state,
        storeReady,
        systemReady: storeReady && state.cryptoReady,
      };
    case 'check_completed':
      return { ...state, checkCompleted: true };
    case 'add_error':
      return { ...state, errorMessage: action.payload };
    default:
      return state;
  }
};

const checkSecureStore = (dispatch) => async () => {
  try {
    const storeReady = await SecureStore.isAvailableAsync();
    dispatch({ type: 'secure_store_available', payload: storeReady });
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
    await Promise.all([initCrypto(dispatch)(), checkSecureStore(dispatch)()]);
  } catch (err) {
    dispatch({ type: 'add_error', payload: err.message });
  }

  dispatch({ type: 'check_completed' });
};

export const { Provider, Context } = createContext(
  systemReducer,
  { checkSystem },
  {
    cryptoReady: false,
    storeReady: false,
    systemReady: false,
    checkCompleted: false,
  }
);
