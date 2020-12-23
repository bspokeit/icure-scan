import iCureAPI from '../api/icure';
import { navigate } from '../utils/navigationHelper';
import createContext from './createContext';

const icureReducer = (state, action) => {
  switch (action.type) {
    case 'crypto_ready':
      return { ...state, cryptoReady: action.payload };
    case 'add_error':
      return { ...state, errorMessage: action.payload };
    default:
      return state;
  }
};

const initCrypto = (dispatch) => async () => {
  try {
    await iCureAPI.initCrypto();
    dispatch({ type: 'crypto_ready', payload: true });
    navigate('Login');
  } catch (err) {
    dispatch({ type: 'add_error', payload: err.message });
    dispatch({ type: 'crypto_ready', payload: false });
  }
};

export const { Provider, Context } = createContext(
  icureReducer,
  { initCrypto },
  { cryptoReady: false }
);
