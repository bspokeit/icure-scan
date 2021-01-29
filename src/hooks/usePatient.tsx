import { Patient, User } from '@icure/api';
import * as _ from 'lodash';
import { useContext } from 'react';
import { getApi as api } from '../api/icure';
import { Context as PatientContext } from '../context/PatientContext';

export default () => {
  const { setSearching, setLogs, setList } = useContext(PatientContext);

  const loadLogs = async (user: User): Promise<void> => {
    try {
      setSearching(true);

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

      const patientIds = _.chain(logPage.rows)
        .map('patientId')
        .compact()
        .uniq()
        .value();

      if (patientIds && patientIds.length) {
        const patientfromLogs = await api().patientApi.getPatientsWithUser(
          user,
          {
            ids: patientIds,
          }
        );

        setLogs(patientfromLogs);
        setList(patientfromLogs);
      } else {
        setLogs([]);
        setList([]);
      }
    } catch (error) {
      console.error(error);
      setLogs([]);
      setList([]);
    }

    setSearching(false);
  };

  const searchPatients = async (user: User, term: string): Promise<void> => {
    try {
      setSearching(true);
      const search = await api().patientApi.findByNameBirthSsinAutoWithUser(
        user,
        user.healthcarePartyId,
        term,
        undefined,
        undefined,
        25,
        undefined
      );
      setList(search.rows as Array<Patient>);
    } catch (error) {
      console.error(error);
      setList([] as Array<Patient>);
    }

    setSearching(false);
  };

  return { loadLogs, searchPatients };
};