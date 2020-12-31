import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-elements';
import { SearchBar } from 'react-native-elements';
import { Context as AuthContext } from '../context/AuthContext';
import { Context as PatientContext } from '../context/PatientContext';

const PatientListScreen = () => {
  const {
    state: { currentUser },
  } = useContext(AuthContext);

  const { accessLogs, loadAccessLogs, searchPatients, addPatient } = useContext(
    PatientContext
  );

  const [query, setQuery] = useState('');

  const createPatient = async () => {
    const patient = await addPatient(currentUser);
  };

  useEffect(() => {
    loadAccessLogs(currentUser);
  }, []);

  //listAccessLogsWithUser

  return (
    <View>
      <SearchBar
        placeholder="Search here..."
        value={query}
        onChangeText={setQuery}
        autoCapitalize="none"
        autoCorrect={false}
        onEndEditing={() => searchPatients(currentUser, query)}
        onClear={() => console.log('Search cleared')}
      />
      <Text>Query: {query}</Text>
      <Button title="Create a patient" onPress={createPatient} />
    </View>
  );
};

const styles = StyleSheet.create({});

export default PatientListScreen;
