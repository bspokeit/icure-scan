import * as SecureStore from 'expo-secure-store';
import { useContext } from 'react';
import {
  Credentials,
  getApi as api,
  getAuthAPI as authApi,
  initApi,
} from '../api/icure';
import { CREDENTIAL_KEY } from '../constant';
import { Context as AuthContext } from '../context/AuthContext';
import { AuthorizationHeader } from '../context/reducer-action/AuthReducerActions';
import { User } from '../models';
import { navigate } from '../utils/navigationHelper';
import useCrypto from './useCrypto';

export default () => {
  const {
    state: { currentHcp, currentParentHcp },
    setLoginOngoing,
    setLogin,
    setLogout,
    setUser,
    setHcp,
    setParent,
    setError,
  } = useContext(AuthContext);

  const { clearPrivateKeyData } = useCrypto();

  const login = async ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }): Promise<void> => {
    setLoginOngoing(true);
    try {
      const response = await authApi().login({
        username,
        password,
      } as Credentials);

      if (!response.successful) {
        await SecureStore.deleteItemAsync(CREDENTIAL_KEY);
        setError('Invalid credentials');
      } else {
        const authHeader: AuthorizationHeader = {
          Authorization: `Basic ${btoa(`${username}:${password}`)}`,
        };

        await SecureStore.setItemAsync(
          CREDENTIAL_KEY,
          JSON.stringify({ username, password })
        );

        setLogin(authHeader);

        initApi({ username, password });

        const currentUser = await api().userApi.getCurrentUser();
        setUser(currentUser as User);

        const currentHcp = await api().healthcarePartyApi.getCurrentHealthcareParty();
        setHcp(currentHcp);

        let parentHcp;
        if (currentHcp.parentId) {
          try {
            parentHcp = await api().healthcarePartyApi.getHealthcareParty(
              currentHcp.parentId,
              true
            );
          } catch (err) {
            throw err;
          }
        }

        setParent(parentHcp);
        navigate('ImportKey');
      }
    } catch (error) {
      console.error(error);
      setError('Something went wrong while login');
    }

    setLoginOngoing(false);
  };

  const autoLogin = async (): Promise<void> => {
    try {
      const credentials: Credentials = JSON.parse(
        (await SecureStore.getItemAsync(CREDENTIAL_KEY)) ?? ''
      );

      if (credentials) {
        await login(credentials);
      } else {
        logout();
      }
    } catch (error) {
      console.error(error);
      logout();
    }
  };

  const logout = async (): Promise<void> => {
    await clearAuthenticationData();
    navigate('Login');
  };

  const clearAuthenticationData = async (): Promise<void> => {
    await SecureStore.deleteItemAsync(CREDENTIAL_KEY);
    await setLogout();
  };

  const logoutHard = async (): Promise<void> => {
    await clearPrivateKeyData(currentHcp);
    await clearPrivateKeyData(currentParentHcp);
  };

  return { login, autoLogin, logout, logoutHard };
};
