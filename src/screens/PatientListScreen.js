import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SearchBar } from 'react-native-elements';

const PatientListScreen = () => {
  const [query, setQuery] = useState('');

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
