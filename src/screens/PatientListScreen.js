import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import SearchBar from '../components/SearchBar';

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
