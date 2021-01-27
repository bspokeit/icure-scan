import React, { useContext } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import ContactListItem from '../components/ContactListItem';
import { Context as PatientContext } from '../context/PatientContext';

const ContactList = ({ patientId }) => {
  const {
    state: { contacts },
  } = useContext(PatientContext);

  return (
    <FlatList
      style={styles.flatListStyle}
      keyExtractor={(item) => item.id}
      data={contacts[patientId]}
      renderItem={({ item }) => (
        <ContactListItem patientId={patientId} contact={item}></ContactListItem>
      )}
      initialNumToRender={2}
      maxToRenderPerBatch={1}
      updateCellsBatchingPeriod={3}
      windowSize={3}
    />
  );
};

const styles = StyleSheet.create({
  flatListStyle: {
    backgroundColor: 'white',
  },
});

export default ContactList;
