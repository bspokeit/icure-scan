import React, { useContext } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import ContactListItem from '../components/ContactListItem';
import { Context as PatientContext } from '../context/PatientContext';
import { navigate } from '../utils/navigationHelper';

const ContactList = ({ patient }) => {
  const {
    state: { contacts },
  } = useContext(PatientContext);

  return (
    <FlatList
      style={styles.flatListStyle}
      keyExtractor={(item) => item.id}
      data={contacts[patient.id]}
      renderItem={({ item }) => (
        <ContactListItem
          patient={patient}
          contact={item}
          onSelection={() => {
            navigate('Gallery', {
              patient: patient,
              contact: item,
            });
          }}
        ></ContactListItem>
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
