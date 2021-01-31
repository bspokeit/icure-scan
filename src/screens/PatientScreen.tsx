import React, { useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  NavigationStackScreenComponent,
  NavigationStackScreenProps,
} from 'react-navigation-stack';
import ContactList from '../components/ContactList';
import { GREEN } from '../constant';
import useContact from '../hooks/useContact';
import { Patient } from '../models';

interface Props extends NavigationStackScreenProps {}

const PatientScreen: NavigationStackScreenComponent<Props> = ({
  navigation,
}) => {
  const patient: Patient = navigation.state.params?.patient;
  const { fetchContacts } = useContact();

  useEffect(() => {
    fetchContacts(patient);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ContactList patient={patient}></ContactList>
      <View style={styles.actionButtonBlock}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            navigation.navigate('Import', { patient });
          }}
        >
          <Icon reverse raised name="add" type="ionicon" color={GREEN} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

PatientScreen.navigationOptions = ({ navigation }) => {
  const patient: Patient = navigation.state.params?.patient;
  return {
    headerTitle: `${patient?.firstName} ${patient?.lastName}`,
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: -20, // TODO: fihure out this margin shift
  },
  actionButtonBlock: {
    position: 'absolute',
    height: 80,
    width: 100,
    right: 0,
    bottom: 0,
  },
});

export default PatientScreen;
