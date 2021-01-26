import React, { useContext } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import ContactListItem from '../components/ContactListItem';
import { Context as PatientContext } from '../context/PatientContext';

const ContactList = () => {
  const {
    state: { patientContacts },
  } = useContext(PatientContext);

  return (
    <FlatList
      style={styles.flatListStyle}
      keyExtractor={(item) => item.id}
      data={patientContacts}
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
});

export default ContactList;