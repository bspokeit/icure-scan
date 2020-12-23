import iCureAPI from '../api/icure';
import createContext from './createContext';
import { navigate } from '../utils/navigationHelper';

const authReducer = (state, action) => {
  switch (action.type) {
    case 'add_error':
      return { ...state, errorMessage: action.payload };
    case 'login':
      return { errorMessage: '', token: action.payload };
    default:
      return state;
  }
};

const login = (dispatch) => async ({ username, password }) => {
  try {
    const response = await iCureAPI.authAPI.login({ username, password });

    if (!response.successful) {
      dispatch({
        type: 'add_error',
        payload: 'Invalid credentials',
      });
    } else {
      navigate('mainFlow');
    }
    // await AsyncStorage.setItem('token', response.data.token);
    // dispatch({ type: 'signin', payload: response.data.token });
  } catch (err) {
    dispatch({
      type: 'add_error',
      payload: 'Something went wrong with login',
    });
  }
};

const logout = (dispatch) => {
  return () => {
    // somehow sign out!!!
  };
};

export const { Provider, Context } = createContext(
  authReducer,
  { login, logout },
  { token: null, errorMessage: '' }
);
