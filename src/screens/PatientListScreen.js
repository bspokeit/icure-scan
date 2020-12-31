import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { Context as AuthContext } from '../context/AuthContext';
import { Context as PatientContext } from '../context/PatientContext';

const PatientListScreen = () => {
  const {
    state: { currentUser },
  } = useContext(AuthContext);

  const { accessLogs, loadAccessLogs } = useContext(PatientContext);

  const [query, setQuery] = useState('');

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
        onEndEditing={() => console.log('query submission')}
        onClear={() => console.log('Search cleared')}
      />
      <Text>Query: {query}</Text>
    </View>
  );
};

const styles = StyleSheet.create({});

export default PatientListScreen;
