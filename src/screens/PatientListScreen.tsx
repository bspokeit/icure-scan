import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import getICureApi from '../api/icure';
import SearchBar from '../components/SearchBar';

getICureApi().then((api) => {
  console.log('iCure loaded');
  api.userApi.getCurrentUser().then((result) => {
    console.log('iCure loaded');
    console.log(result);
  });
});

const PatientListScreen = () => {
  const [query, setQuery] = useState('');

  return (
    <View>
      <SearchBar
        query={query}
        onQueryChange={setQuery}
        onQuerySubmit={() => console.log('query submission')}
      />
      <Text>Patient List Sreen</Text>
      <Text>Query: {query}</Text>
    </View>
  );
};

const styles = StyleSheet.create({});

export default PatientListScreen;
