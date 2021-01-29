import { Patient } from '@icure/api';
import createContext from './createContext';
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
) => {
  dispatch({
    type: PatientActionTypes.SetSearching,
    payload: searching,
  });
};

const resetSearch = (dispatch: React.Dispatch<PatientAction>) => async () => {
  dispatch({
    type: PatientActionTypes.ResetSearch,
  });
};

const setList = (dispatch: React.Dispatch<PatientAction>) => async (
  list: Array<Patient>
) => {
  dispatch({
    type: PatientActionTypes.SetSearch,
    payload: list,
  });
};

const setLogs = (dispatch: React.Dispatch<PatientAction>) => async (
  logs: Array<Patient>
) => {
  dispatch({
    type: PatientActionTypes.SetLogs,
    payload: logs,
  });
};

const collectDocuments = (dispatch: React.Dispatch<PatientAction>) => async ({
  patientId,
  documents,
}: CollectDocumentActionPayload) => {
  dispatch({
    type: PatientActionTypes.CollectDocuments,
    payload: { patientId, documents },
  });
};

const collectContacts = (dispatch: React.Dispatch<PatientAction>) => async ({
  patientId,
  contacts,
}: CollectContactActionPayload) => {
  dispatch({
    type: PatientActionTypes.CollectContacts,
    payload: { patientId, contacts },
  });
};

export const { Provider, Context } = createContext(
  patientReducer,
  {
    setSearching,
    setLogs,
    setList,
    resetSearch,
    collectDocuments,
    collectContacts,
  },
  {
    logs: [],
    list: [],
    searching: false,
    contacts: {},
    documents: {},
  }
);
