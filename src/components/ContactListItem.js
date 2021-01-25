import moment from 'moment';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card } from 'react-native-elements';
import DocumentListItem from '../components/DocumentListItem';
import {
  getDocumentIdFromService,
  getDocumentServices,
} from '../utils/contactHelper';

const ContactListItem = ({ contact }) => {
  return (
    <View>
      <Card>
        <Card.Title>
          Contact du {moment(contact.created).format('DD/MM/YYYY hh:MM')}
        </Card.Title>
        <Card.Divider />
        {getDocumentServices(contact).map((s, i) => {
          return (
            <View key={i}>
              <DocumentListItem
                documentId={getDocumentIdFromService(s)}
              ></DocumentListItem>
            </View>
          );
        })}
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  flatListStyle: {
    backgroundColor: 'white',
  },
  imageContainerStyle: {
    flex: 1,
    margin: 1,
  },
  imageStyle: {
    height: 120,
    width: '100%',
  },
});

export default ContactListItem;
