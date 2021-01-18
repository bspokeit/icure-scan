import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const PatientDetailScreen = ({ navigation }) => {
  const patientId = navigation.getParam('patientId');
  console.log('PatientId: ', patientId);
  return (
    <SafeAreaView>
      <Text>`Patient Detail Sreen: ${patientId}`</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({});

export default PatientDetailScreen;
