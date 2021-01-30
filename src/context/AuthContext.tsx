import React, { createContext, useReducer } from 'react';
import { HealthcareParty, User } from '../models';
import {
  AuthAction,
  AuthActionTypes,
  AuthorizationHeader,
  AuthState,
} from './reducer-action/AuthReducerActions';

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case AuthActionTypes.SetOngoing:
      return { ...state, ongoing: action.payload };
    case AuthActionTypes.Login:
      return { authHeader: action.payload, error: undefined };
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

const setLoginOngoing = (dispatch: React.Dispatch<AuthAction>) => async (
  status: boolean
): Promise<void> => {
  dispatch({ type: AuthActionTypes.SetOngoing, payload: status });
};

const setLogin = (dispatch: React.Dispatch<AuthAction>) => async (
  header: AuthorizationHeader
): Promise<void> => {
  dispatch({ type: AuthActionTypes.Login, payload: header });
};

const setLogout = (
  dispatch: React.Dispatch<AuthAction>
) => async (): Promise<void> => {
  dispatch({ type: AuthActionTypes.Logout });
};

const setUser = (dispatch: React.Dispatch<AuthAction>) => async (
  user: User
): Promise<void> => {
  dispatch({ type: AuthActionTypes.SetUser, payload: user });
};

const setHcp = (dispatch: React.Dispatch<AuthAction>) => async (
  hcp: HealthcareParty
): Promise<void> => {
  dispatch({ type: AuthActionTypes.SetHcp, payload: hcp });
};

const setParent = (dispatch: React.Dispatch<AuthAction>) => async (
  hcp: HealthcareParty
): Promise<void> => {
  dispatch({ type: AuthActionTypes.SetParent, payload: hcp });
};

const setError = (dispatch: React.Dispatch<AuthAction>) => async (
  error: string
): Promise<void> => {
  dispatch({ type: AuthActionTypes.SetError, payload: error });
};

const defaultAuthState: AuthState = {};

const defaultAuthDispatcher = {
  setLoginOngoing: (_a: boolean) => Promise.resolve(),
  setLogin: (_a: AuthorizationHeader) => Promise.resolve(),
  setLogout: () => Promise.resolve(),
  setUser: (_a: User) => Promise.resolve(),
  setHcp: (_a: HealthcareParty) => Promise.resolve(),
  setParent: (_a: HealthcareParty) => Promise.resolve(),
  setError: (_a: string) => Promise.resolve(),
};

export const Context = createContext<{
  state: AuthState;
  setLoginOngoing: (status: boolean) => Promise<void>;
  setLogin: (header: AuthorizationHeader) => Promise<void>;
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
    setLogin: setLogin(dispatch),
    setLogout: setLogout(dispatch),
    setUser: setUser(dispatch),
    setHcp: setHcp(dispatch),
    setParent: setParent(dispatch),
    setError: setError(dispatch),
  };
  return (
    <Context.Provider value={{ state, ...dispatcher }}>
      {children}
    </Context.Provider>
  );
};
