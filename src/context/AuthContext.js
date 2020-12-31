import * as SecureStore from 'expo-secure-store';
import iCureAPI from '../api/icure';
import { navigate } from '../utils/navigationHelper';
import createContext from './createContext';

const CREDENTIAL_KEY = 'credentials';

const authReducer = (state, action) => {
  switch (action.type) {
    case 'add_error':
      return { errorMessage: action.payload };
    case 'clear_authentication_data':
      return {};
    case 'login':
      return { authHeader: action.payload, errorMessage: '' };
    case 'current_user':
      return { ...state, currentUser: action.payload };
    case 'current_hcp':
      return { ...state, currentHcp: action.payload };
    case 'parent_hcp':
      return { ...state, parentHcp: action.payload };
    default:
      return state;
  }
};

const login = (dispatch) => async ({ username, password }) => {
  try {
    const response = await iCureAPI.getAuthAPI().login({ username, password });

    if (!response.successful) {
      await SecureStore.deleteItemAsync(CREDENTIAL_KEY);
      dispatch({
        type: 'add_error',
        payload: 'Invalid credentials',
      });
    } else {
      const authHeader = {
        Authorization: `Basic ${
          typeof btoa !== 'undefined'
            ? btoa(`${username}:${password}`)
            : Buffer.from(`${username}:${password}`).toString('base64')
        }`,
      };
      await SecureStore.setItemAsync(
        CREDENTIAL_KEY,
        JSON.stringify({ username, password })
      );
      dispatch({ type: 'login', payload: authHeader });

      iCureAPI.addHeaders(authHeader);

      const currentUser = await iCureAPI.getUserAPI().getCurrentUser();
      dispatch({ type: 'current_user', payload: currentUser });

      const currentHcp = await iCureAPI.getHcpAPI().getCurrentHealthcareParty();
      dispatch({ type: 'current_hcp', payload: currentHcp });

      let parentHcp;
      if (currentHcp.parentId) {
        try {
          parentHcp = await iCureAPI
            .getHcpAPI()
            .getHealthcareParty(currentHcp.parentId, true);
        } catch (err) {
          console.log(err);
        }
      }

      dispatch({ type: 'parent_hcp', payload: parentHcp });

      navigate('ImportKey');
    }
  } catch (err) {
    console.log(err);
    dispatch({
      type: 'add_error',
      payload: 'Something went wrong with login',
    });
  }
};

const autoLogin = (dispatch) => async () => {
  try {
    const credentials = JSON.parse(
      await SecureStore.getItemAsync(CREDENTIAL_KEY)
    );

    if (credentials) {
      await login(dispatch)(credentials);
    } else {
      navigate('Login');
    }
  } catch (err) {
    console.log(err);
    navigate('Login');
  }
};

const logout = (dispatch) => async () => {
  await clearAuthenticationData(dispatch);
  navigate('Login');
};

const clearAuthenticationData = async (dispatch) => {
  await SecureStore.deleteItemAsync(CREDENTIAL_KEY);
  dispatch({
    type: 'clear_authentication_data',
  });
};

export const { Provider, Context } = createContext(
  authReducer,
  { login, logout, autoLogin },
  {}
);
