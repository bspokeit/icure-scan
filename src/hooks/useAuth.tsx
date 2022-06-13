/*
 * Copyright (C) 2021 Bspoke IT SRL
 *
 * This file is part of icure-scan.
 *
 * icure-scan is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * icure-scan is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with icure-scan.  If not, see <http://www.gnu.org/licenses/>.
 */

import { IccUserXApi, XHR } from '@icure/api';
import * as SecureStore from 'expo-secure-store';
import { useContext } from 'react';
import {
  Credentials,
  ErrorHandler,
  getAPI as api,
  getAuthAPI as authApi,
  getUserAPI as userApi,
  IccApiHeaders,
  init,
} from '../api/icure';
import { AUTHENTICATION_HEADER } from '../constant';
import { Context as AuthContext } from '../context/AuthContext';
import { User } from '../models';
import { navigate } from '../utils/navigationHelper';
import useCrypto from './useCrypto';

export default () => {
  const {
    state: { currentHcp, currentParentHcp },
    setLoginOngoing,
    setAuthHeader,
    setSession,
    setLogout,
    setUser,
    setHcp,
    setParent,
    setError,
  } = useContext(AuthContext);

  const { clearPrivateKeyData } = useCrypto();

  const apiErrorInterceptor: ErrorHandler = (error: XHR.XHRError) => {
    if (error.statusCode === 401) {
      handle401();
    }

    throw error;
  };

  const initApi = (headers?: IccApiHeaders) => {
    init(headers, apiErrorInterceptor);
  };

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
        await SecureStore.deleteItemAsync(AUTHENTICATION_HEADER);
        setError('Invalid credentials');
      } else {
        const authHeader: XHR.Header = {
          header: 'Authorization',
          data: `Basic ${btoa(`${username}:${password}`)}`,
        };

        await SecureStore.setItemAsync(
          AUTHENTICATION_HEADER,
          JSON.stringify(authHeader)
        );

        setAuthHeader(authHeader);

        handleActiveSession();
      }
    } catch (error) {
      setError('Something went wrong while login');
    }

    setLoginOngoing(false);
  };

  const getSession = async () => {
    try {
      //const session = await userApi().getCurrentSession();
      //setSession(session);
    } catch (error) {
      //  Impossible to fecth the session. That's ok.
      console.log(error);
    }
  };

  const loadUser = async () => {
    const currentUser = await api().userApi.getCurrentUser();
    console.log(currentUser);
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
  };

  const getAuthHeader = async (): Promise<any /*XHR.Header*/ | undefined> => {
    const storedHeaderAsString = await SecureStore.getItemAsync(
      AUTHENTICATION_HEADER
    );

    if (!!storedHeaderAsString) {
      try {
        const authHeader = JSON.parse(storedHeaderAsString);
        setAuthHeader(authHeader);
        return authHeader;
      } catch (error) {
        //  AuthHeader parsinf failed. It is therefore useless => let's clean
        await SecureStore.deleteItemAsync(AUTHENTICATION_HEADER);
        setAuthHeader(undefined);
      }
    }
  };

  const getAuthenticatedUserApi = (authHeader: XHR.Header): IccUserXApi => {
    const bareUserApi = userApi();
    bareUserApi.setHeaders([...bareUserApi.headers, authHeader]);

    return bareUserApi;
  };

  const handleActiveSession = async () => {
    //  If the session is valid, we can setup the iccApi (still without headers as a session exists) and
    //  load user details
    try {
      //await getSession();
      initApi();
      await loadUser();
      navigate('ImportKey');
    } catch (error) {
      //  Something went wrong. Just log the user out an redirect to login screen
      console.log(error);
      await cleanAndRedirectToLogin();
    }
  };

  const autoLogin = async (): Promise<void> => {
    //  First we test if a valid session exists using a bare user api instance free of
    //  any Authentication headers
    const sessionIsActive = await sessionActive();

    if (sessionIsActive) {
      handleActiveSession();
    } else {
      //  If the session is invalid or does not exists we can check for an AuthHeader to reactivate the
      //  user session before redirecting him to the login.
      const authHeaderCandidate = await getAuthHeader();

      //  If there is no auth header, there is nothing else we can do
      if (!authHeaderCandidate) {
        return await cleanAndRedirectToLogin();
      }

      //  To revive the session we need to exchange something with the serveur with a AuthHeader.
      const bareAutheticatedUserApi = getAuthenticatedUserApi(
        authHeaderCandidate
      );

      const sessionRevived = await sessionActive(bareAutheticatedUserApi);
      if (sessionRevived) {
        handleActiveSession();
      } else {
        //  There is no session to re activate => redirect to login properly
        await cleanAndRedirectToLogin();
      }
    }
  };

  const cleanAndRedirectToLogin = async () => {
    await clearAuthenticationData();
    navigate('Login');
  };

  const logUserOut = async (): Promise<void> => {
    try {
      await authApi().logout();
    } catch (error) {
      //  Nothing else to do at this point.
    }
    await clearAuthenticationData();
    navigate('Login');
  };

  const clearAuthenticationData = async (): Promise<void> => {
    await SecureStore.deleteItemAsync(AUTHENTICATION_HEADER);
    await setLogout();
  };

  const logoutUserOutHard = async (): Promise<void> => {
    await clearPrivateKeyData(currentHcp);
    await clearPrivateKeyData(currentParentHcp);
    await logUserOut();
  };

  const sessionActive = async (
    customUserApi?: IccUserXApi
  ): Promise<boolean> => {
    try {
      const uApi = customUserApi ?? userApi();
      const current = await uApi.getCurrentUser();
      return !!current;
    } catch (error) {
      //  Session has expired if error.statusCode = 401. But here we take any error
      //  as a signal of a missing session (for now). Any subsequent calls errors will
      //  be properly handled by a dedicated ErrorInterceptor.
      return false;
    }
  };

  const handle401 = () => {
    autoLogin();
  };

  return { login, autoLogin, logUserOut, logoutUserOutHard, sessionActive };
};
