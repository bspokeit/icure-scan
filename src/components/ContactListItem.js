import moment from 'moment';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import DocumentListItem from '../components/DocumentListItem';
import {
  getDocumentIdFromService,
  getDocumentServices,
} from '../utils/contactHelper';

const ContactListItem = ({ contact }) => {
  return (
    <View style={styles.container}>
      <View style={styles.itemHeader}>
        <Text style={styles.itemHeaderText}>
          Contact du {moment(contact.created).format('DD/MM/YYYY')}
        </Text>
      </View>
      <View style={styles.itemContent}>
        <FlatList
          style={styles.flatListStyle}
          numColumns={3}
          keyExtractor={(item) => item.id}
          data={getDocumentServices(contact)}
          renderItem={({ item }) => (
            <View style={styles.imageContainerStyle}>
              <DocumentListItem
                documentId={getDocumentIdFromService(item)}
              ></DocumentListItem>
            </View>
          )}
          initialNumToRender={2}
          maxToRenderPerBatch={1}
          updateCellsBatchingPeriod={3}
          windowSize={3}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
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
  itemHeader: {
    flex: 1,
    height: 36,
    borderColor: 'blue',
    borderWidth: 1,
    marginLeft: 5,
    marginRight: 5,
  },
  itemHeaderText: {
    color: 'blue',
    flex: 1,
    flexDirection: 'row',
    fontSize: 16,
    paddingLeft: 15,
    textAlignVertical: 'center',
  },
  itemContent: {
    flex: 1,
    marginLeft: 5,
    marginRight: 5,
  },
});

export default ContactListItem;
