import * as SecureStore from 'expo-secure-store';
import { compact } from 'lodash';
import iCureAPI from '../api/icure';
import createContext from './createContext';

const patientReducer = (state, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

const loadAccessLog = (dispatch) => async () => {
  return [];
};

export const { Provider, Context } = createContext(patientReducer, {}, {});
