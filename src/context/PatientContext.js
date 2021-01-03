import { Patient } from '@icure/api';
import { getApi as api } from '../api/icure';
import createContext from './createContext';
import _ from 'lodash';

const patientReducer = (state, action) => {
  switch (action.type) {
    case 'get_access_log':
      return { ...state, accessLogs: action.payload };
    case 'set_searching':
      return { ...state, searching: action.payload };
    case 'set_search':
      return { ...state, patientList: action.payload };
    default:
      return state;
  }
};

const loadAccessLogs = (dispatch) => async (user) => {
  try {
    dispatch({ type: 'set_searching', payload: true });

    const now = Date.now();
    const threeDaysAgo = now - 3 * 24 * 60 * 60 * 1000;
    const logPage = await api().accessLogApi.listAccessLogsWithUser(
      user,
      threeDaysAgo,
      now,
      null,
      null,
      25,
      null
    );

    const patientIds = _(logPage.rows)
      .map('patientId')
      .compact()
      .uniq()
      .value();

    dispatch({ type: 'get_access_log', payload: patientIds });

    if (patientIds && patientIds.length) {
      const patientfromLogs = await api().patientApi.getPatientsWithUser(user, {
        ids: patientIds,
      });

      dispatch({ type: 'set_search', payload: patientfromLogs });
    } else {
      dispatch({ type: 'set_search', payload: [] });
    }

    dispatch({ type: 'set_searching', payload: false });
  } catch (error) {
    console.log(error);
    dispatch({ type: 'get_access_log', payload: [] });
    dispatch({ type: 'set_search', payload: [] });
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
  },
  { accessLogs: [], patientList: [], searching: false }
);
