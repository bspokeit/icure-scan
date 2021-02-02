import _ from 'lodash';
import React, { createContext, useReducer } from 'react';
import {
  defaultSystemChecks,
  SystemAction,
  SystemActionTypes,
  SystemCheck,
  SystemState,
} from './reducer-action/SystemReducerActions';

const systemReducer = (
  state: SystemState,
  action: SystemAction
): SystemState => {
  switch (action.type) {
    case SystemActionTypes.UpdateSystemCheck:
      const updatedCheck = action.payload;
      const checks = [...state.systemChecks];
      const index = _.findIndex(checks, (c) => c.type === updatedCheck.type);

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

const updateSystemCheck = (dispatch: React.Dispatch<SystemAction>) => async (
  systemCheck: SystemCheck
): Promise<void> => {
  dispatch({
    type: SystemActionTypes.UpdateSystemCheck,
    payload: systemCheck,
  });
};

const setSystemChecked = (dispatch: React.Dispatch<SystemAction>) => async (
  status: boolean
): Promise<void> => {
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
  return (
    <Context.Provider value={{ state, ...dispatcher }}>
      {children}
    </Context.Provider>
  );
};

export default { Context, Provider };
