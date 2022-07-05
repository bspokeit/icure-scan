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
import { Patient } from '../models';
import {
  CollectContactActionPayload,
  collectContactsAction,
  collectDocumentAction,
  CollectDocumentActionPayload,
  PatientAction,
  PatientActionTypes,
  PatientState
} from './reducer-action/PatientReducerActions';

const patientReducer = (
  state: PatientState,
  action: PatientAction,
): PatientState => {
  switch (action.type) {
    case PatientActionTypes.SetSearching:
      return {...state, searching: action.payload};
    case PatientActionTypes.SetSearch:
      return {...state, list: action.payload};
    case PatientActionTypes.ResetSearch:
      return {...state, list: state.logs};
    case PatientActionTypes.SetLogs:
      return {...state, logs: action.payload};
    case PatientActionTypes.CollectContacts:
      return collectContactsAction(state, action.payload);
    case PatientActionTypes.CollectDocuments:
      return collectDocumentAction(state, action.payload);
    default:
      return state;
  }
};

const setSearching =
  (dispatch: React.Dispatch<PatientAction>) =>
  async (searching: boolean): Promise<void> => {
    dispatch({
      type: PatientActionTypes.SetSearching,
      payload: searching,
    });
  };

const resetSearch =
  (dispatch: React.Dispatch<PatientAction>) => async (): Promise<void> => {
    dispatch({
      type: PatientActionTypes.ResetSearch,
    });
  };

const setLogs =
  (dispatch: React.Dispatch<PatientAction>) =>
  async (logs: Array<Patient>): Promise<void> => {
    dispatch({
      type: PatientActionTypes.SetLogs,
      payload: logs,
    });
  };

const setList =
  (dispatch: React.Dispatch<PatientAction>) =>
  async (list: Array<Patient>): Promise<void> => {
    dispatch({
      type: PatientActionTypes.SetSearch,
      payload: list,
    });
  };

const collectContacts =
  (dispatch: React.Dispatch<PatientAction>) =>
  async ({patientId, contacts}: CollectContactActionPayload): Promise<void> => {
    dispatch({
      type: PatientActionTypes.CollectContacts,
      payload: {patientId, contacts},
    });
  };

const collectDocuments =
  (dispatch: React.Dispatch<PatientAction>) =>
  async ({
    patientId,
    documents,
  }: CollectDocumentActionPayload): Promise<void> => {
    dispatch({
      type: PatientActionTypes.CollectDocuments,
      payload: {patientId, documents},
    });
  };

const defaultPatientState: PatientState = {
  logs: [],
  list: [],
  searching: false,
  contacts: {},
  documents: {},
};

const defaultPatientDispatcher = {
  setSearching: (_a: boolean) => Promise.resolve(),
  resetSearch: () => Promise.resolve(),
  setLogs: (_a: Array<Patient>) => Promise.resolve(),
  setList: (_a: Array<Patient>) => Promise.resolve(),
  collectContacts: (_a: CollectContactActionPayload) => Promise.resolve(),
  collectDocuments: (_a: CollectDocumentActionPayload) => Promise.resolve(),
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
  state: defaultPatientState,
  ...defaultPatientDispatcher,
});

export const Provider: React.FC = ({children}) => {
  const [state, dispatch] = useReducer(patientReducer, defaultPatientState);

  const dispatcher = {
    setSearching: setSearching(dispatch),
    resetSearch: resetSearch(dispatch),
    setLogs: setLogs(dispatch),
    setList: setList(dispatch),
    collectDocuments: collectDocuments(dispatch),
    collectContacts: collectContacts(dispatch),
  };

  return (
    <Context.Provider value={{state, ...dispatcher}}>
      {children}
    </Context.Provider>
  );
};

export default {Context, Provider};
