import { Patient } from '@icure/api';
import React, { createContext, useReducer } from 'react';
import {
  CollectContactActionPayload,
  collectContactsAction,
  collectDocumentAction,
  CollectDocumentActionPayload,
  PatientAction,
  PatientActionTypes,
  PatientState,
} from './reducer-action/PatientReducerActions';

const patientReducer = (
  state: PatientState,
  action: PatientAction
): PatientState => {
  switch (action.type) {
    case PatientActionTypes.SetSearching:
      return { ...state, searching: action.payload };
    case PatientActionTypes.SetSearch:
      return { ...state, list: action.payload };
    case PatientActionTypes.ResetSearch:
      return { ...state, list: state.logs };
    case PatientActionTypes.SetLogs:
      return { ...state, logs: action.payload };
    case PatientActionTypes.CollectContacts:
      return collectContactsAction(state, action.payload);
    case PatientActionTypes.CollectDocuments:
      return collectDocumentAction(state, action.payload);
    default:
      return state;
  }
};

const setSearching = (dispatch: React.Dispatch<PatientAction>) => async (
  searching: boolean
): Promise<void> => {
  dispatch({
    type: PatientActionTypes.SetSearching,
    payload: searching,
  });
};

const resetSearch = (
  dispatch: React.Dispatch<PatientAction>
) => async (): Promise<void> => {
  dispatch({
    type: PatientActionTypes.ResetSearch,
  });
};

const setLogs = (dispatch: React.Dispatch<PatientAction>) => async (
  logs: Array<Patient>
): Promise<void> => {
  dispatch({
    type: PatientActionTypes.SetLogs,
    payload: logs,
  });
};

const setList = (dispatch: React.Dispatch<PatientAction>) => async (
  list: Array<Patient>
): Promise<void> => {
  dispatch({
    type: PatientActionTypes.SetSearch,
    payload: list,
  });
};

const collectContacts = (dispatch: React.Dispatch<PatientAction>) => async ({
  patientId,
  contacts,
}: CollectContactActionPayload): Promise<void> => {
  dispatch({
    type: PatientActionTypes.CollectContacts,
    payload: { patientId, contacts },
  });
};

const collectDocuments = (dispatch: React.Dispatch<PatientAction>) => async ({
  patientId,
  documents,
}: CollectDocumentActionPayload): Promise<void> => {
  dispatch({
    type: PatientActionTypes.CollectDocuments,
    payload: { patientId, documents },
  });
};

const patientDefaultValues: PatientState = {
  logs: [],
  list: [],
  searching: false,
  contacts: {},
  documents: {},
};

const patientDefaultDispatcher = {
  setSearching: (_: boolean) => Promise.resolve(),
  resetSearch: () => Promise.resolve(),
  setLogs: (_: Array<Patient>) => Promise.resolve(),
  setList: (_: Array<Patient>) => Promise.resolve(),
  collectContacts: (_: CollectContactActionPayload) => Promise.resolve(),
  collectDocuments: (_: CollectDocumentActionPayload) => Promise.resolve(),
};

export const Context = createContext<{
  state: PatientState;
  setSearching: (searching: boolean) => Promise<void>;
  resetSearch: () => Promise<void>;
  setLogs: (logs: Array<Patient>) => Promise<void>;
  setList: (list: Array<Patient>) => Promise<void>;
  collectContacts: ({
    patientId,
    contacts,
  }: CollectContactActionPayload) => Promise<void>;
  collectDocuments: ({
    patientId,
    documents,
  }: CollectDocumentActionPayload) => Promise<void>;
}>({
  state: patientDefaultValues,
  ...patientDefaultDispatcher,
});

export const Provider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(patientReducer, patientDefaultValues);

  const dispatcher = {
    setSearching: setSearching(dispatch),
    resetSearch: resetSearch(dispatch),
    setLogs: setLogs(dispatch),
    setList: setList(dispatch),
    collectDocuments: collectDocuments(dispatch),
    collectContacts: collectContacts(dispatch),
  };

  return (
    <Context.Provider value={{ state, ...dispatcher }}>
      {children}
    </Context.Provider>
  );
};

export default { Context, Provider };
