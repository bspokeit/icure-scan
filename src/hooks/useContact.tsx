import {
  AbstractFilterService,
  FilterChainService,
  ListOfIds,
  Patient,
} from '@icure/api';
import * as _ from 'lodash';
import { useContext } from 'react';
import { getApi as api } from '../api/icure';
import { DOCUMENT_SERVICE_TAGS } from '../constant';
import { Context as AuthContext } from '../context/AuthContext';
import { Context as PatientContext } from '../context/PatientContext';
import { FilterType } from '../utils/filterHelper';

export default () => {
  const {
    state: { currentUser },
  } = useContext(AuthContext);
  const { collectContacts } = useContext(PatientContext);

  const fetchContacts = async (patient: Patient): Promise<void> => {
    try {
      const sfks = await api().cryptoApi.extractSFKsHierarchyFromDelegations(
        patient,
        currentUser!!.healthcarePartyId
      );

      const secretForeignKey = _.find(sfks, {
        hcpartyId: currentUser!!.healthcarePartyId,
      });

      if (!secretForeignKey || !secretForeignKey.extractedKeys.length) {
        throw new Error('No secret foreing key has been found!');
      }

      const unionFilter: FilterChainService = {
        filter: new AbstractFilterService({
          $type: FilterType.UnionFilter,
          filters: DOCUMENT_SERVICE_TAGS.map(
            (t) =>
              new AbstractFilterService({
                $type: FilterType.ServiceByHcPartyTagCodeDateFilter,
                healthcarePartyId: currentUser!!.healthcarePartyId,
                patientSecretForeignKey: secretForeignKey.extractedKeys[0],
                tagType: t.type,
                tagCode: t.code,
              })
          ),
        }),
      };

      const servicesByTags = await api().contactApi.filterServicesBy(
        undefined,
        undefined,
        unionFilter
      );

      const contacts = await api().contactApi.getContactsWithUser(
        currentUser!!,
        {
          ids: _.chain(servicesByTags.rows)
            .map((s) => s.contactId)
            .uniq()
            .value(),
        } as ListOfIds
      );

      collectContacts({ patientId: patient.id!!, contacts });
    } catch (error) {
      console.error(error);
    }
  };
  return { fetchContacts };
};
