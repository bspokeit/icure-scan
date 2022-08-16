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

import { ListItem } from '@rneui/base';
import { first } from 'lodash';
import moment from 'moment';
import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { DEFAULT_BORDER, LIGHT_GREY, MAIN_COLOR } from '../constant';
import useDocument from '../hooks/useDocument';
import { Contact, Patient } from '../models';
import DocumentAvatar from './DocumentAvatar';

interface Props {
  patient: Patient;
  contact: Contact;
  onSelection: () => void;
}

const ContactListItem: React.FC<Props> = ({ patient, contact, onSelection }) => {
  const { fetchContactDocumentIds } = useDocument();
  return (
    <ListItem onPress={onSelection} containerStyle={styles.container} underlayColor={LIGHT_GREY}>
      <DocumentAvatar patientId={patient.id} documentId={first(fetchContactDocumentIds(contact))}></DocumentAvatar>
      <ListItem.Content>
        <ListItem.Title style={styles.title}>Contact du {moment(contact.created).format('DD/MM/YYYY')}</ListItem.Title>
        <ListItem.Subtitle>
          <Text style={styles.subTitle}>{fetchContactDocumentIds(contact).length} document(s)</Text>
        </ListItem.Subtitle>
      </ListItem.Content>
      <ListItem.Chevron color={MAIN_COLOR} />
    </ListItem>
  );
};

const styles = StyleSheet.create({
  container: {
    marginLeft: 8,
    marginRight: 8,
    marginTop: 3,
    marginBottom: 3,
    borderRadius: DEFAULT_BORDER,
  },
  title: {
    color: MAIN_COLOR,
  },
  subTitle: {
    fontSize: 12,
    color: LIGHT_GREY,
  },
});

export default ContactListItem;
