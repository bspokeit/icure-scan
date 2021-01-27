import React, { useContext, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DocumentGallery from '../components/DocumentGallery';
import { Context as AuthContext } from '../context/AuthContext';
import { Context as PatientContext } from '../context/PatientContext';

const DocumentGalleryScreen = ({ navigation }) => {
  const {
    state: { contacts },
    getContacts,
  } = useContext(PatientContext);

  const {
    state: { currentUser },
  } = useContext(AuthContext);

  const patient = navigation.getParam('patient');
  const contact = navigation.getParam('contact');

  useEffect(() => {
    getContacts(currentUser, patient);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <DocumentGallery patient={patient} contact={contact}></DocumentGallery>
    </SafeAreaView>
  );
};

DocumentGalleryScreen.navigationOptions = ({ navigation }) => {
  const patient = navigation.getParam('patient');
  return {
    headerTitle: `${patient.firstName} ${patient.lastName}`,
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: -20, // TODO: fihure out this margin shift
    justifyContent: 'center',
  },
  actionButtonBlock: {
    position: 'absolute',
    height: 80,
    width: '100%',
    left: 0,
    right: 0,
    bottom: 0,
    paddingRight: 20,
    justifyContent: 'flex-end',
    flexDirection: 'row',
    backgroundColor: 'transparent',
  },
});

export default DocumentGalleryScreen;
