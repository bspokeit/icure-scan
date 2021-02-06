/*
 * Copyright (C) 2021 Bspoke IT SRL
 *
 * This file is part of icure-scan.
 *
 * icure-scan is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * icure-scan is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with icure-scan.  If not, see <http://www.gnu.org/licenses/>.
 */

import {
  AbstractFilterService,
  FilterChainService,
  ListOfIds,
} from '@icure/api';
import _ from 'lodash';
import { useContext } from 'react';
import { getAPI as api } from '../api/icure';
import { DOCUMENT_SERVICE_TAGS } from '../constant';
import { Context as AuthContext } from '../context/AuthContext';
import { Context as PatientContext } from '../context/PatientContext';
import { Patient } from '../models';
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
        currentUser?.healthcarePartyId
      );

      const secretForeignKey = _.find(sfks, {
        hcpartyId: currentUser?.healthcarePartyId,
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
                healthcarePartyId: currentUser?.healthcarePartyId,
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

      collectContacts({ patientId: patient.id, contacts });
    } catch (error) {
      console.error(error);
    }
  };
  return { fetchContacts };
};
