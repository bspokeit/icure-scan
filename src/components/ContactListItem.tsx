import { first } from 'lodash';
import moment from 'moment';
import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { ListItem } from 'react-native-elements';
import { LIGHT_GREY } from '../constant';
import useDocument from '../hooks/useDocument';
import { Contact, Patient } from '../models';
import DocumentAvatar from './DocumentAvatar';

interface Props {
  patient: Patient;
  contact: Contact;
  onSelection: () => void;
}

const ContactListItem: React.FC<Props> = ({
  patient,
  contact,
  onSelection,
}) => {
  const { fetchContactDocumentIds } = useDocument();
  return (
    <ListItem
      onPress={onSelection}
      containerStyle={styles.container}
      underlayColor={LIGHT_GREY}
    >
      <DocumentAvatar
        patientId={patient.id}
        documentId={first(fetchContactDocumentIds(contact))}
      ></DocumentAvatar>
      <ListItem.Content>
        <ListItem.Title>
          Contact du {moment(contact.created).format('DD/MM/YYYY')}
        </ListItem.Title>
        <ListItem.Subtitle>
          <Text style={styles.subTitle}>
            {fetchContactDocumentIds(contact).length} document(s)
          </Text>
        </ListItem.Subtitle>
      </ListItem.Content>
      <ListItem.Chevron />
    </ListItem>
  );
};

const styles = StyleSheet.create({
  container: {
    marginLeft: 8,
    marginRight: 8,
    marginBottom: 6,
    borderRadius: 8,
  },
  subTitle: {
    fontSize: 14,
  },
});

export default ContactListItem;
