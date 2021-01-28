import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { ListItem } from 'react-native-elements';
import DocumentListItem from '../components/DocumentListItem';
import useDocumentResolver from '../hooks/useDocumentResolver';
//import { getDocumentIdFromService } from '../utils/contactHelper';
import { first } from 'lodash';

const ContactListItem = ({ patient, contact, onSelection }) => {
  const [services, setServices] = useState([]);
  const { fetchContactDocumentIds } = useDocumentResolver();

  // useEffect(() => {
  //   setServices(fetchContactServices(contact));
  // }, []);

  return (
    <ListItem onPress={onSelection} bottomDivider>
      <DocumentListItem
        patientId={patient.id}
        documentId={first(fetchContactDocumentIds(contact))}
      ></DocumentListItem>
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
  subTitle: {
    fontSize: 14,
  },
});

export default ContactListItem;
