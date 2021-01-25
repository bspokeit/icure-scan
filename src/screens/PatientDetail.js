import React, { useContext, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import ContactList from '../components/ContactList';
import { Context as AuthContext } from '../context/AuthContext';
import { Context as PatientContext } from '../context/PatientContext';

const PatientDetailScreen = ({ navigation }) => {
  const {
    state: { patientContacts },
    getContacts,
  } = useContext(PatientContext);

  const {
    state: { currentUser },
  } = useContext(AuthContext);

  const patient = navigation.getParam('patient');

  useEffect(() => {
    getContacts(currentUser, patient);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View>
        {patientContacts.length ? (
          <View>
            <ContactList></ContactList>
          </View>
        ) : null}
      </View>
      <View style={styles.actionButtonBlock}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            navigation.navigate('Import', { patient });
          }}
        >
          <Icon reverse raised name="add" type="ionicon" color="green" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

PatientDetailScreen.navigationOptions = ({ navigation }) => {
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

export default PatientDetailScreen;
