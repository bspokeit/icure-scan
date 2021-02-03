import React, { useCallback, useContext } from 'react';
import { FlatList } from 'react-native';
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

  const keyExtractor = useCallback((item) => item.id, []);

  const renderItem = useCallback(
    ({ item }) => (
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
    ),
    []
  );

  return (
    <FlatList
      keyExtractor={keyExtractor}
      data={
        contacts && contacts[patient.id] && contacts[patient.id].length
          ? contacts[patient.id]
          : []
      }
      renderItem={renderItem}
      initialNumToRender={4}
      maxToRenderPerBatch={2}
      onEndReachedThreshold={0.1}
      windowSize={6}
      style={{ marginBottom: 56 }}
    />
  );
};

export default ContactList;
