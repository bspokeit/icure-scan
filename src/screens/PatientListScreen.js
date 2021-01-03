import React, { useContext, useEffect, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import PatientListItem from '../components/PatientListItem';
import { Context as AuthContext } from '../context/AuthContext';
import { Context as PatientContext } from '../context/PatientContext';

const PatientListScreen = () => {
  const {
    state: { currentUser },
  } = useContext(AuthContext);

  const {
    state: { patientList, searching },
    loadAccessLogs,
    searchPatients,
    clearSearch,
  } = useContext(PatientContext);

  const [query, setQuery] = useState('');

  useEffect(() => {
    loadAccessLogs(currentUser);
  }, []);

  const keyExtractor = (item) => item.id;

  const renderItem = ({ item }) => (
    <PatientListItem patient={item}></PatientListItem>
  );

  return (
    <SafeAreaView>
      <SearchBar
        placeholder="Search here..."
        lightTheme
        value={query}
        onChangeText={setQuery}
        autoCapitalize="none"
        autoCorrect={false}
        onEndEditing={() => searchPatients(currentUser, query)}
        onClear={clearSearch}
        showLoading={searching}
        disabled={searching}
        loadingProps={{ color: '#2089dc', size: 'small' }}
      />
      <FlatList
        keyExtractor={keyExtractor}
        data={patientList}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
};

PatientListScreen.navigationOptions = () => {
  return {
    headerShown: false,
  };
};

const styles = StyleSheet.create({
  subTitle: {
    fontSize: 12,
  },
});

export default PatientListScreen;
