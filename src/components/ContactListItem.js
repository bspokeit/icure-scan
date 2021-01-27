import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { ListItem } from 'react-native-elements';
import DocumentListItem from '../components/DocumentListItem';
import {
  getDocumentIdFromService,
  getDocumentServices,
} from '../utils/contactHelper';

const ContactListItem = ({ patient, contact, onSelection }) => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    setServices(getDocumentServices(contact));
  }, []);

  return (
    <ListItem onPress={onSelection} bottomDivider>
      <DocumentListItem
        patientId={patient.id}
        documentId={getDocumentIdFromService(services[0])}
      ></DocumentListItem>
      <ListItem.Content>
        <ListItem.Title>
          Contact du {moment(contact.created).format('DD/MM/YYYY')}
        </ListItem.Title>
        <ListItem.Subtitle>
          <Text style={styles.subTitle}>{services.length} document(s)</Text>
        </ListItem.Subtitle>
      </ListItem.Content>
      <ListItem.Chevron />
    </ListItem>
  );
};

const styles = StyleSheet.create({
  subTitle: {
    fontSize: 14,
  },
});

export default ContactListItem;
