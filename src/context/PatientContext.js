import { getApi as api } from '../api/icure';
import createContext from './createContext';

const patientReducer = (state, action) => {
  switch (action.type) {
    case 'get_access_log':
      return { ...state, accessLogs: action.payload };
    default:
      return state;
  }
};

const loadAccessLogs = (dispatch) => async (user) => {
  const logPage = await api().accessLogApi.listAccessLogsWithUser(user);
  dispatch({ type: 'get_access_log', payload: logPage.rows });
};

export const { Provider, Context } = createContext(
  patientReducer,
  {
    loadAccessLogs,
  },
  { accessLogs: [] }
);
