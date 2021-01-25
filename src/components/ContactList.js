import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import ContactListItem from '../components/ContactListItem';

const ContactList = ({ contacts }) => {
  return (
    <FlatList
      style={styles.flatListStyle}
      keyExtractor={(item) => item.id}
      data={contacts}
      renderItem={({ item }) => (
        <ContactListItem contact={item}></ContactListItem>
      )}
    />
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

export default ContactList;
