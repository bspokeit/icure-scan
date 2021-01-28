import { User } from '@icure/api';
import { chain } from 'lodash';
import { getApi as api } from '../api/icure';
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
    case PatientActionTypes.ClearSearch:
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

const loadAccessLogs = (dispatch: React.Dispatch<PatientAction>) => async (
  user: User
) => {
  try {
    dispatch({ type: PatientActionTypes.SetSearching, payload: true });

    const now = Date.now();
    const tenDaysAgo = now - 20 * 24 * 60 * 60 * 1000;
    const logPage = await api().accessLogApi.listAccessLogsWithUser(
      user,
      tenDaysAgo,
      now,
      undefined,
      undefined,
      25,
      undefined
    );

    const patientIds = chain(logPage.rows)
      .map('patientId')
      .compact()
      .uniq()
      .value();

    if (patientIds && patientIds.length) {
      const patientfromLogs = await api().patientApi.getPatientsWithUser(user, {
        ids: patientIds,
      });

      dispatch({ type: PatientActionTypes.SetLogs, payload: patientfromLogs });
      dispatch({
        type: PatientActionTypes.SetSearch,
        payload: patientfromLogs,
      });
    } else {
      dispatch({ type: PatientActionTypes.SetLogs, payload: [] });
      dispatch({ type: PatientActionTypes.SetSearch, payload: [] });
    }

    dispatch({ type: PatientActionTypes.SetSearching, payload: false });
  } catch (error) {
    console.error(error);
    dispatch({ type: PatientActionTypes.SetSearch, payload: [] });
    dispatch({ type: PatientActionTypes.SetLogs, payload: [] });
    dispatch({ type: PatientActionTypes.SetSearching, payload: false });
  }
};

const searchPatients = (dispatch: React.Dispatch<PatientAction>) => async (
  user: User,
  term: string
): Promise<void> => {
  try {
    dispatch({ type: PatientActionTypes.SetSearching, payload: true });
    const search = await api().patientApi.findByNameBirthSsinAutoWithUser(
      user,
      user.healthcarePartyId,
      term,
      undefined,
      undefined,
      25,
      undefined
    );
    dispatch({ type: PatientActionTypes.SetSearch, payload: search.rows });
    dispatch({ type: PatientActionTypes.SetSearching, payload: false });
  } catch (error) {
    console.error(error);
    dispatch({ type: PatientActionTypes.SetSearch, payload: [] });
    dispatch({ type: PatientActionTypes.SetSearching, payload: false });
  }
};

const clearSearch = (dispatch: React.Dispatch<PatientAction>) => async () => {
  dispatch({
    type: PatientActionTypes.ClearSearch,
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
    loadAccessLogs,
    searchPatients,
    clearSearch,
    collectDocuments,
    collectContacts,
  },
  {
    logs: [],
    list: [],
    searching: false,
    contacts: {},
    documents: {},
  } as PatientState
);
