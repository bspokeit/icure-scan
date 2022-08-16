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

import _ from 'lodash';
import React, { createContext, useReducer } from 'react';
import {
  defaultSystemChecks,
  SystemAction,
  SystemActionTypes,
  SystemCheck,
  SystemState,
} from './reducer-action/SystemReducerActions';

const systemReducer = (state: SystemState, action: SystemAction): SystemState => {
  switch (action.type) {
    case SystemActionTypes.UpdateSystemCheck:
      const updatedCheck = action.payload;
      const checks = [...state.systemChecks];
      const index = _.findIndex(checks, c => c.type === updatedCheck.type);

      if (index > -1) {
        checks[index] = updatedCheck;
      }

      return { ...state, systemChecks: [...checks] };
    case SystemActionTypes.SetCheckCompleted:
      return { ...state, checkCompleted: true };
    default:
      return state;
  }
};

const updateSystemCheck =
  (dispatch: React.Dispatch<SystemAction>) =>
  async (systemCheck: SystemCheck): Promise<void> => {
    dispatch({
      type: SystemActionTypes.UpdateSystemCheck,
      payload: systemCheck,
    });
  };

const setSystemChecked =
  (dispatch: React.Dispatch<SystemAction>) =>
  async (status: boolean): Promise<void> => {
    dispatch({ type: SystemActionTypes.SetCheckCompleted, payload: status });
  };

const defaultSystemState: SystemState = {
  systemChecks: defaultSystemChecks,
  checkCompleted: false,
};

const defaultSystemDispatcher = {
  updateSystemCheck: (_a: SystemCheck) => Promise.resolve(),
  setSystemChecked: (_a: boolean) => Promise.resolve(),
};

export const Context = createContext<{
  state: SystemState;
  updateSystemCheck: (systemCheck: SystemCheck) => Promise<void>;
  setSystemChecked: (status: boolean) => Promise<void>;
}>({
  state: defaultSystemState,
  ...defaultSystemDispatcher,
});

export const Provider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(systemReducer, defaultSystemState);

  const dispatcher = {
    updateSystemCheck: updateSystemCheck(dispatch),
    setSystemChecked: setSystemChecked(dispatch),
  };
  return <Context.Provider value={{ state, ...dispatcher }}>{children}</Context.Provider>;
};

export default { Context, Provider };
