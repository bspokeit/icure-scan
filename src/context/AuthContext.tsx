/*
 * Copyright (C) 2022 Bspoke IT SRL
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

import { XHR } from '@icure/api';
import React, { createContext, useReducer } from 'react';
import { HealthcareParty, User } from '../models';
import { AuthAction, AuthActionTypes, AuthState } from './reducer-action/AuthReducerActions';

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case AuthActionTypes.SetOngoing:
      return { ...state, ongoing: action.payload };
    case AuthActionTypes.SetAuthHeader:
      return { authHeader: action.payload, error: undefined };
    case AuthActionTypes.SetSession:
      return { ...state, session: action.payload };
    case AuthActionTypes.Logout:
      return {};
    case AuthActionTypes.SetUser:
      return { ...state, currentUser: action.payload };
    case AuthActionTypes.SetHcp:
      return { ...state, currentHcp: action.payload };
    case AuthActionTypes.SetParent:
      return { ...state, currentParentHcp: action.payload };
    case AuthActionTypes.SetError:
      return { error: action.payload };
    default:
      return state;
  }
};

const setLoginOngoing =
  (dispatch: React.Dispatch<AuthAction>) =>
  async (status: boolean): Promise<void> => {
    dispatch({ type: AuthActionTypes.SetOngoing, payload: status });
  };

const setAuthHeader =
  (dispatch: React.Dispatch<AuthAction>) =>
  async (header?: XHR.Header): Promise<void> => {
    dispatch({ type: AuthActionTypes.SetAuthHeader, payload: header });
  };

const setSession =
  (dispatch: React.Dispatch<AuthAction>) =>
  async (session: string): Promise<void> => {
    dispatch({ type: AuthActionTypes.SetSession, payload: session });
  };

const setLogout = (dispatch: React.Dispatch<AuthAction>) => async (): Promise<void> => {
  dispatch({ type: AuthActionTypes.Logout });
};

const setUser =
  (dispatch: React.Dispatch<AuthAction>) =>
  async (user: User): Promise<void> => {
    dispatch({ type: AuthActionTypes.SetUser, payload: user });
  };

const setHcp =
  (dispatch: React.Dispatch<AuthAction>) =>
  async (hcp: HealthcareParty): Promise<void> => {
    dispatch({ type: AuthActionTypes.SetHcp, payload: hcp });
  };

const setParent =
  (dispatch: React.Dispatch<AuthAction>) =>
  async (hcp: HealthcareParty): Promise<void> => {
    dispatch({ type: AuthActionTypes.SetParent, payload: hcp });
  };

const setError =
  (dispatch: React.Dispatch<AuthAction>) =>
  async (error: string): Promise<void> => {
    dispatch({ type: AuthActionTypes.SetError, payload: error });
  };

const defaultAuthState: AuthState = {};

const defaultAuthDispatcher = {
  setLoginOngoing: (_a: boolean) => Promise.resolve(),
  setAuthHeader: (_a?: XHR.Header) => Promise.resolve(),
  setSession: (_a: string) => Promise.resolve(),
  setLogout: () => Promise.resolve(),
  setUser: (_a: User) => Promise.resolve(),
  setHcp: (_a: HealthcareParty) => Promise.resolve(),
  setParent: (_a: HealthcareParty) => Promise.resolve(),
  setError: (_a: string) => Promise.resolve(),
};

export const Context = createContext<{
  state: AuthState;
  setLoginOngoing: (status: boolean) => Promise<void>;
  setAuthHeader: (header?: XHR.Header) => Promise<void>;
  setSession: (session: string) => Promise<void>;
  setLogout: () => Promise<void>;
  setUser: (user: User) => Promise<void>;
  setHcp: (hcp: HealthcareParty) => Promise<void>;
  setParent: (hcp: HealthcareParty) => Promise<void>;
  setError: (error: string) => Promise<void>;
}>({
  state: defaultAuthState,
  ...defaultAuthDispatcher,
});

export const Provider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, defaultAuthState);

  const dispatcher = {
    setLoginOngoing: setLoginOngoing(dispatch),
    setAuthHeader: setAuthHeader(dispatch),
    setSession: setSession(dispatch),
    setLogout: setLogout(dispatch),
    setUser: setUser(dispatch),
    setHcp: setHcp(dispatch),
    setParent: setParent(dispatch),
    setError: setError(dispatch),
  };
  return <Context.Provider value={{ state, ...dispatcher }}>{children}</Context.Provider>;
};
