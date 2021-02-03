import { XHR } from '@icure/api';
import { ActionMap, HealthcareParty, User } from '../../models';

export interface AuthState {
  ongoing?: boolean;
  currentUser?: User;
  currentHcp?: HealthcareParty;
  currentParentHcp?: HealthcareParty;
  authHeader?: XHR.Header;
  session?: string;
  error?: string;
}

export enum AuthActionTypes {
  SetOngoing = 'SET_ONGOING',
  SetAuthHeader = 'SET_AUTH_HEADER',
  SetSession = 'SET_SESSION',
  Logout = 'LOGOUT',
  SetUser = 'SET_USER',
  SetHcp = 'SET_HCP',
  SetParent = 'SET_PARENT',
  SetError = 'SET_ERROR',
}

export type AuthActionPayloadTypes = {
  [AuthActionTypes.SetOngoing]: boolean;
  [AuthActionTypes.SetAuthHeader]: XHR.Header | undefined;
  [AuthActionTypes.SetSession]: string;
  [AuthActionTypes.Logout]: undefined;
  [AuthActionTypes.SetUser]: User;
  [AuthActionTypes.SetHcp]: HealthcareParty;
  [AuthActionTypes.SetParent]: HealthcareParty;
  [AuthActionTypes.SetError]: string;
};

export type AuthAction = ActionMap<AuthActionPayloadTypes>[keyof ActionMap<AuthActionPayloadTypes>];
