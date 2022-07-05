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

export type AuthAction =
  ActionMap<AuthActionPayloadTypes>[keyof ActionMap<AuthActionPayloadTypes>];
