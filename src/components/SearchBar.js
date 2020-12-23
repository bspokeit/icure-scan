import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

const SearchBar = ({ query, onQueryChange, onQuerySubmit }) => {
  return (
    <View style={styles.container}>
      <Feather style={styles.icon} name="search" />
      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        style={styles.input}
        placeholder="Search"
        value={query}
        onChangeText={onQueryChange}
        onEndEditing={onQuerySubmit}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F0EEEE',
    height: 50,
    borderRadius: 5,
    marginTop: 12,
    marginHorizontal: 12,
    flexDirection: 'row',
  },
  icon: {
    fontSize: 30,
    alignSelf: 'center',
    marginHorizontal: 12,
  },
  input: {
    flex: 1,
    fontSize: 18,
  },
});

export default SearchBar;
