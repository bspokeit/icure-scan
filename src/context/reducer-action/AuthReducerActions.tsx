import { HealthcareParty, User, XHR } from '@icure/api';
import { ActionMap } from '../../models';

export interface AuthorizationHeader {
  Authorization: string;
}

export interface AuthState {
  ongoing?: boolean;
  currentUser?: User;
  currentHcp?: HealthcareParty;
  currentParentHcp?: HealthcareParty;
  authHeader?: AuthorizationHeader;
  error?: string;
}

export enum AuthActionTypes {
  SetOngoing = 'SET_ONGOING',
  Login = 'LOGIN',
  Logout = 'LOGOUT',
  SetUser = 'SET_USER',
  SetHcp = 'SET_HCP',
  SetParent = 'SET_PARENT',
  SetError = 'SET_ERROR',
}

export type AuthActionPayloadTypes = {
  [AuthActionTypes.SetOngoing]: boolean;
  [AuthActionTypes.Login]: AuthorizationHeader;
  [AuthActionTypes.Logout]: undefined;
  [AuthActionTypes.SetUser]: User;
  [AuthActionTypes.SetHcp]: HealthcareParty;
  [AuthActionTypes.SetParent]: HealthcareParty;
  [AuthActionTypes.SetError]: string;
};

export type AuthAction = ActionMap<AuthActionPayloadTypes>[keyof ActionMap<AuthActionPayloadTypes>];
