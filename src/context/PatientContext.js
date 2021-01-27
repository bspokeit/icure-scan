import { Patient } from '@icure/api';
import { chain, find, orderBy, uniq } from 'lodash';
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
    console.log(error);
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
    console.log(error);
    dispatch({ type: 'set_search', payload: [] });
    dispatch({ type: 'set_searching', payload: false });
  }
};

const clearSearch = (dispatch) => async () => {
  dispatch({
    type: 'clear_search',
  });
};

const addPatient = (dispatch) => async (user) => {
  const patient = await api().patientApi.createPatientWithUser(
    user,
    await api().patientApi.newInstance(
      user,
      new Patient({
        lastName: 'Obama',
        firstName: 'Barack',
        note: 'A secured note that is encrypted',
      })
    )
  );
};

const getContacts = (dispatch) => async (user, patient) => {
  try {
    const sfks = await api().cryptoApi.extractSFKsHierarchyFromDelegations(
      patient,
      user.healthcarePartyId
    );

    const secretForeignKey = find(sfks, {
      hcpartyId: user.healthcarePartyId,
    });

    if (!secretForeignKey || !secretForeignKey.extractedKeys.length) {
      throw new Error('No secret foreing key has been found!');
    }

    const filter = {
      $type: 'ServiceByHcPartyTagCodeDateFilter',
      healthcarePartyId: user.healthcarePartyId,
      patientSecretForeignKey: secretForeignKey.extractedKeys[0],
      tagType: 'CD-ITEM',
      tagCode: 'document',
    };

    const servicesByTags = await api().contactApi.filterServicesBy(null, null, {
      filter,
    });

    const contacts = await api().contactApi.getContactsWithUser(user, {
      ids: uniq(servicesByTags.rows.map((s) => s.contactId)),
    });

    dispatch({
      type: 'collect_contacts',
      payload: {
        patientId: patient.id,
        contacts: orderBy(contacts, ['created'], ['desc']),
      },
    });
  } catch (e) {
    console.log(e);
  }
};

const collectDocuments = (dispatch) => async ({ patientId, documents }) => {
  dispatch({
    type: 'collect_document',
    payload: { patientId, documents },
  });
};

export const { Provider, Context } = createContext(
  patientReducer,
  {
    loadAccessLogs,
    searchPatients,
    clearSearch,
    getContacts,
    collectDocuments,
  },
  {
    accessLogs: [],
    patientList: [],
    searching: false,
    contacts: {},
    documents: {},
  }
);
