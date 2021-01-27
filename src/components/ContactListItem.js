import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { ListItem } from 'react-native-elements';
import DocumentListItem from '../components/DocumentListItem';
import {
  getDocumentIdFromService,
  getDocumentServices,
} from '../utils/contactHelper';

const ContactListItem = ({ contact }) => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    setServices(getDocumentServices(contact));
    console.log(getDocumentIdFromService(services[0]));
  }, []);

  return (
    <ListItem bottomDivider>
      <DocumentListItem
        documentId={getDocumentIdFromService(services[0])}
      ></DocumentListItem>
      <ListItem.Content>
        <ListItem.Title>
          Contact du {moment(contact.created).format('DD/MM/YYYY')}
        </ListItem.Title>
        <ListItem.Subtitle>
          <Text style={styles.subTitle}>{services.length} documents</Text>
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
