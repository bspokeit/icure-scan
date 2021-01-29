import { find, uniq } from 'lodash';
import { useContext } from 'react';
import { getApi as api } from '../api/icure';
import { Context as PatientContext } from '../context/PatientContext';
import { Context as AuthContext } from '../context/AuthContext';

export default () => {
  const {
    state: { currentUser },
  } = useContext(AuthContext);
  const { collectContacts } = useContext(PatientContext);

  const fetchContacts = async (patient) => {
    try {
      const sfks = await api().cryptoApi.extractSFKsHierarchyFromDelegations(
        patient,
        currentUser.healthcarePartyId
      );

      const secretForeignKey = find(sfks, {
        hcpartyId: currentUser.healthcarePartyId,
      });

      if (!secretForeignKey || !secretForeignKey.extractedKeys.length) {
        throw new Error('No secret foreing key has been found!');
      }

      const filter = {
        $type: 'ServiceByHcPartyTagCodeDateFilter',
        healthcarePartyId: currentUser.healthcarePartyId,
        patientSecretForeignKey: secretForeignKey.extractedKeys[0],
        tagType: 'CD-ITEM',
        tagCode: 'document',
      };

      const servicesByTags = await api().contactApi.filterServicesBy(
        null,
        null,
        {
          filter,
        }
      );

      const contacts = await api().contactApi.getContactsWithUser(currentUser, {
        ids: uniq(servicesByTags.rows.map((s) => s.contactId)),
      });

      collectContacts({ patientId: patient.id, contacts });
    } catch (error) {
      console.error(error);
    }
  };
  return { fetchContacts };
};
