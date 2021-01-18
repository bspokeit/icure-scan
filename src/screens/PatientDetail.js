import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const PatientDetailScreen = ({ navigation }) => {
  const patient = navigation.getParam('patient');

  return (
    <SafeAreaView>
      <Text>`Patient Detail Screen: ${patient.id}`</Text>
    </SafeAreaView>
  );
};

PatientDetailScreen.navigationOptions = ({ navigation }) => {
  const patient = navigation.getParam('patient');
  return {
    headerTitle: `${patient.firstName} ${patient.lastName}`,
  };
};

const styles = StyleSheet.create({});

export default PatientDetailScreen;
