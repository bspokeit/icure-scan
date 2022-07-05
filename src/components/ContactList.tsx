/*
 * Copyright (C) 2022 Bspoke IT SRL
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

import React, { useCallback, useContext } from 'react';
import { FlatList } from 'react-native';
import { Context as PatientContext } from '../context/PatientContext';
import { Patient } from '../models';
import { navigate } from '../utils/navigationHelper';
import ContactListItem from './ContactListItem';

interface Props {
  patient: Patient;
}

const ContactList: React.FC<Props> = ({patient}) => {
  const {
    state: {contacts},
  } = useContext(PatientContext);

  const keyExtractor = useCallback(item => item.id, []);

  const renderItem = useCallback(
    ({item}) => (
      <ContactListItem
        patient={patient}
        contact={item}
        onSelection={() => {
          navigate('Gallery', {
            patient: patient,
            contact: item,
          });
        }}></ContactListItem>
    ),
    [],
  );

  return (
    <FlatList
      keyExtractor={keyExtractor}
      data={
        contacts && contacts[patient.id] && contacts[patient.id].length
          ? contacts[patient.id]
          : []
      }
      renderItem={renderItem}
      initialNumToRender={4}
      maxToRenderPerBatch={2}
      onEndReachedThreshold={0.1}
      windowSize={6}
      style={{marginBottom: 56}}
    />
  );
};

export default ContactList;
