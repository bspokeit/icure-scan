import { getApi as api } from '../api/icure';
import { Patient } from '@icure/api';
import createContext from './createContext';

const patientReducer = (state, action) => {
  switch (action.type) {
    case 'get_access_log':
      return { ...state, accessLogs: action.payload };
    case 'search_patient':
      return { ...state, search: action.payload };
    default:
      return state;
  }
};

const loadAccessLogs = (dispatch) => async (user) => {
  const logPage = await api().accessLogApi.listAccessLogsWithUser(user);
  dispatch({ type: 'get_access_log', payload: logPage.rows });
};

const searchPatients = (dispatch) => async (user, term) => {
  //fuzzySearchWithUser
  //findByNameBirthSsinAutoWithUser(user: User, healthcarePartyId?: string, filterValue?: string, startKey?: string, startDocumentId?: string, limit?: number, sortDirection?: string): never;
  try {
    const search = await api().patientApi.findByNameBirthSsinAutoWithUser(
      user,
      user.healthcarePartyId,
      term,
      null,
      null,
      5,
      null
    );
    console.log(search.rows);
    dispatch({ type: 'search_patient', payload: search.rows });
  } catch (error) {
    console.log(error);
    dispatch({ type: 'search_patient', payload: [] });
  }
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

export const { Provider, Context } = createContext(
  patientReducer,
  {
    loadAccessLogs,
    searchPatients,
    addPatient,
  },
  { accessLogs: [] }
);
