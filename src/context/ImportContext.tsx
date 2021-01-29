import React, { createContext, useReducer } from 'react';
import {
  ImportTask,
  ImportTaskDocument,
  ImportTaskStatus,
} from '../models/core/import-task.model';
import {
  ImportAction,
  ImportActionTypes,
  ImportState,
  ImportStatus,
} from './reducer-action/ImportReducerActions';

const importReducer = (
  state: ImportState,
  action: ImportAction
): ImportState => {
  switch (action.type) {
    case ImportActionTypes.Collect:
      return {
        ...state,
        documents: [...state.documents, action.payload],
      };
    case ImportActionTypes.Clear:
      return { ...state, documents: [] };
    case ImportActionTypes.Activate:
      return { ...state, active: action.payload };
    case ImportActionTypes.SetStatus:
      return { ...state, status: action.payload };
    case ImportActionTypes.SetTasks:
      return { ...state, tasks: action.payload };
    case ImportActionTypes.UpdateTask:
      const updatedTasks = [...state.tasks].map((t) => {
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

const collect = (dispatch: React.Dispatch<ImportAction>) => async (
  taskDoc: ImportTaskDocument
): Promise<void> => {
  if (!taskDoc.cancelled) {
    dispatch({ type: ImportActionTypes.Collect, payload: taskDoc });
  }
};

const clear = (
  dispatch: React.Dispatch<ImportAction>
) => async (): Promise<void> => {
  dispatch({ type: ImportActionTypes.Clear });
};

const activate = (dispatch: React.Dispatch<ImportAction>) => async (
  active: boolean
): Promise<void> => {
  dispatch({ type: ImportActionTypes.Activate, payload: active });
};

const setStatus = (dispatch: React.Dispatch<ImportAction>) => async (
  status: ImportStatus
): Promise<void> => {
  dispatch({ type: ImportActionTypes.SetStatus, payload: status });
};

const setTasks = (dispatch: React.Dispatch<ImportAction>) => async (
  tasks: Array<ImportTask>
): Promise<void> => {
  dispatch({ type: ImportActionTypes.SetTasks, payload: tasks });
};

const updateTask = (dispatch: React.Dispatch<ImportAction>) => async (
  id: string,
  status: ImportTaskStatus
): Promise<void> => {
  dispatch({ type: ImportActionTypes.UpdateTask, payload: { id, status } });
};

const setFinal = (dispatch: React.Dispatch<ImportAction>) => async (
  task: ImportTask | undefined
): Promise<void> => {
  dispatch({ type: ImportActionTypes.SetFinal, payload: task });
};

const defaultImportState: ImportState = {
  active: false,
  status: ImportStatus.Pending,
  documents: [],
  tasks: [],
};

const defaultImportDispatcher = {
  collect: (_a: ImportTaskDocument) => Promise.resolve(),
  clear: () => Promise.resolve(),
  activate: (_a: boolean) => Promise.resolve(),
  setStatus: (_a: ImportStatus) => Promise.resolve(),
  setTasks: (_a: Array<ImportTask>) => Promise.resolve(),
  updateTask: (_a: string, _b: ImportTaskStatus) => Promise.resolve(),
  setFinal: (_a: ImportTask | undefined) => Promise.resolve(),
};

export const Context = createContext<{
  state: ImportState;
  collect: (taskDoc: ImportTaskDocument) => Promise<void>;
  clear: () => Promise<void>;
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
    activate: activate(dispatch),
    setStatus: setStatus(dispatch),
    setTasks: setTasks(dispatch),
    updateTask: updateTask(dispatch),
    setFinal: setFinal(dispatch),
  };
  return (
    <Context.Provider value={{ state, ...dispatcher }}>
      {children}
    </Context.Provider>
  );
};

export default { Context, Provider };
