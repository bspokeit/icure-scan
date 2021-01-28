import { chain } from 'lodash';
import { getApi as api } from '../api/icure';
import createContext from './createContext';
import {
  collectContactsAction,
  collectDocumentAction,
} from './reducer-action/PatientReducerActions';

const MAX_STORED_RESOLVED_DOCUMENTS = 50;

const patientReducer = (state, action) => {
  switch (action.type) {
    case 'set_patient_logs':
      return { ...state, patientsLogs: action.payload };
    case 'set_searching':
      return { ...state, searching: action.payload };
    case 'set_search':
      return { ...state, patientList: action.payload };
    case 'clear_search':
      return { ...state, patientList: state.patientsLogs };
    case 'collect_contacts':
      return collectContactsAction(state, action);
    case 'collect_document':
      return collectDocumentAction(state, action);
    default:
      return state;
  }
};

const loadAccessLogs = (dispatch) => async (user) => {
  try {
    dispatch({ type: 'set_searching', payload: true });

    const now = Date.now();
    const tenDaysAgo = now - 20 * 24 * 60 * 60 * 1000;
    const logPage = await api().accessLogApi.listAccessLogsWithUser(
      user,
      tenDaysAgo,
      now,
      null,
      null,
      25,
      null
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

      dispatch({ type: 'set_patient_logs', payload: patientfromLogs });
      dispatch({ type: 'set_search', payload: patientfromLogs });
    } else {
      dispatch({ type: 'set_patient_logs', payload: [] });
      dispatch({ type: 'set_search', payload: [] });
    }

    dispatch({ type: 'set_searching', payload: false });
  } catch (error) {
    console.error(error);
    dispatch({ type: 'set_search', payload: [] });
    dispatch({ type: 'set_patient_logs', payload: [] });
    dispatch({ type: 'set_searching', payload: false });
  }
};

const searchPatients = (dispatch) => async (user, term) => {
  try {
    dispatch({ type: 'set_searching', payload: true });
    const search = await api().patientApi.findByNameBirthSsinAutoWithUser(
      user,
      user.healthcarePartyId,
      term,
      null,
      null,
      25,
      null
    );
    dispatch({ type: 'set_search', payload: search.rows });
    dispatch({ type: 'set_searching', payload: false });
  } catch (error) {
    console.error(error);
    dispatch({ type: 'set_search', payload: [] });
    dispatch({ type: 'set_searching', payload: false });
  }
};

const clearSearch = (dispatch) => async () => {
  dispatch({
    type: 'clear_search',
  });
};

const collectDocuments = (dispatch) => async ({ patientId, documents }) => {
  dispatch({
    type: 'collect_document',
    payload: { patientId, documents },
  });
};

const collectContacts = (dispatch) => async ({ patientId, contacts }) => {
  dispatch({
    type: 'collect_contacts',
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
    accessLogs: [],
    patientList: [],
    searching: false,
    contacts: {},
    documents: {},
  }
);
