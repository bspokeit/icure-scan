import { Patient } from '@icure/api';
import { getApi as api } from '../api/icure';
import createContext from './createContext';
import _ from 'lodash';

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
    case 'collect_image':
      return { ...state, images: [...state.images, action.payload] };
    case 'clear_images':
      return { ...state, images: [] };
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

const collectImage = (dispatch) => async (image) => {
  dispatch({ type: 'collect_image', payload: image });
};

const clearImages = (dispatch) => async () => {
  dispatch({ type: 'clear_images' });
};

export const { Provider, Context } = createContext(
  patientReducer,
  {
    loadAccessLogs,
    searchPatients,
    clearSearch,
    collectImage,
    clearImages,
  },
  { accessLogs: [], patientList: [], searching: false, images: [] }
);