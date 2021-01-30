import React, { useContext } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { Context as PatientContext } from '../context/PatientContext';
import { Patient } from '../models';
import { navigate } from '../utils/navigationHelper';
import ContactListItem from './ContactListItem';

interface Props {
  patient: Patient;
}

const ContactList: React.FC<Props> = ({ patient }) => {
  const {
    state: { contacts },
  } = useContext(PatientContext);

  return (
    <FlatList
      style={styles.flatListStyle}
      keyExtractor={(item) => item.id}
      data={
        contacts && contacts[patient.id] && contacts[patient.id].length
          ? contacts[patient.id]
          : []
      }
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
    />
  );
};

const styles = StyleSheet.create({
  flatListStyle: {
    backgroundColor: 'white',
  },
});

export default ContactList;
