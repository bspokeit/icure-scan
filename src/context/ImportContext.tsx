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

import React, { createContext, useReducer } from 'react';
import { ImportTask, ImportTaskDocument, ImportTaskStatus } from '../models/core/import-task.model';
import { ImportAction, ImportActionTypes, ImportState, ImportStatus } from './reducer-action/ImportReducerActions';

const importReducer = (state: ImportState, action: ImportAction): ImportState => {
  switch (action.type) {
    case ImportActionTypes.Collect:
      console.log({
        ...state,
        documents: [...state.documents, action.payload],
      });
      return {
        ...state,
        documents: [...state.documents, action.payload],
      };
    case ImportActionTypes.Clear:
      return { ...state, documents: [] };
    case ImportActionTypes.Reset:
      return {
        ...state,
        tasks: [],
        final: undefined,
        status: ImportStatus.Pending,
      };
    case ImportActionTypes.Activate:
      return { ...state, active: action.payload };
    case ImportActionTypes.SetStatus:
      return { ...state, status: action.payload };
    case ImportActionTypes.SetTasks:
      return { ...state, tasks: action.payload };
    case ImportActionTypes.UpdateTask:
      const updatedTasks = [...state.tasks].map(t => {
        if (t.id === action.payload.id) {
          t.status = action.payload.status;
        }
        return t;
      });
      return { ...state, tasks: updatedTasks };
    case ImportActionTypes.SetFinal:
      return { ...state, final: action.payload };
    default:
      return state;
  }
};

const collect =
  (dispatch: React.Dispatch<ImportAction>) =>
  async (taskDocs: Array<ImportTaskDocument>): Promise<void> => {
    taskDocs?.forEach(taskDoc => {
      if (!taskDoc.cancelled) {
        dispatch({ type: ImportActionTypes.Collect, payload: taskDoc });
      }
    });
  };

const clear = (dispatch: React.Dispatch<ImportAction>) => async (): Promise<void> => {
  dispatch({ type: ImportActionTypes.Clear });
};

const activate =
  (dispatch: React.Dispatch<ImportAction>) =>
  async (active: boolean): Promise<void> => {
    dispatch({ type: ImportActionTypes.Activate, payload: active });
  };

const setStatus =
  (dispatch: React.Dispatch<ImportAction>) =>
  async (status: ImportStatus): Promise<void> => {
    dispatch({ type: ImportActionTypes.SetStatus, payload: status });
  };

const setTasks =
  (dispatch: React.Dispatch<ImportAction>) =>
  async (tasks: Array<ImportTask>): Promise<void> => {
    dispatch({ type: ImportActionTypes.SetTasks, payload: tasks });
  };

const updateTask =
  (dispatch: React.Dispatch<ImportAction>) =>
  async (id: string, status: ImportTaskStatus): Promise<void> => {
    dispatch({ type: ImportActionTypes.UpdateTask, payload: { id, status } });
  };

const setFinal =
  (dispatch: React.Dispatch<ImportAction>) =>
  async (task: ImportTask | undefined): Promise<void> => {
    dispatch({ type: ImportActionTypes.SetFinal, payload: task });
  };

const reset = (dispatch: React.Dispatch<ImportAction>) => async (): Promise<void> => {
  dispatch({ type: ImportActionTypes.Reset });
};

const defaultImportState: ImportState = {
  active: false,
  status: ImportStatus.Pending,
  documents: [],
  tasks: [],
};

const defaultImportDispatcher = {
  collect: (_a: Array<ImportTaskDocument>) => Promise.resolve(),
  clear: () => Promise.resolve(),
  reset: () => Promise.resolve(),
  activate: (_a: boolean) => Promise.resolve(),
  setStatus: (_a: ImportStatus) => Promise.resolve(),
  setTasks: (_a: Array<ImportTask>) => Promise.resolve(),
  updateTask: (_a: string, _b: ImportTaskStatus) => Promise.resolve(),
  setFinal: (_a: ImportTask | undefined) => Promise.resolve(),
};

export const Context = createContext<{
  state: ImportState;
  collect: (taskDocs: Array<ImportTaskDocument>) => Promise<void>;
  clear: () => Promise<void>;
  reset: () => Promise<void>;
  activate: (active: boolean) => Promise<void>;
  setStatus: (status: ImportStatus) => Promise<void>;
  setTasks: (tasks: Array<ImportTask>) => Promise<void>;
  updateTask: (id: string, status: ImportTaskStatus) => Promise<void>;
  setFinal: (task: ImportTask | undefined) => Promise<void>;
}>({
  state: defaultImportState,
  ...defaultImportDispatcher,
});

export const Provider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(importReducer, defaultImportState);

  const dispatcher = {
    collect: collect(dispatch),
    clear: clear(dispatch),
    reset: reset(dispatch),
    activate: activate(dispatch),
    setStatus: setStatus(dispatch),
    setTasks: setTasks(dispatch),
    updateTask: updateTask(dispatch),
    setFinal: setFinal(dispatch),
  };
  return <Context.Provider value={{ state, ...dispatcher }}>{children}</Context.Provider>;
};

export default { Context, Provider };
