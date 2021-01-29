import React, { useContext, useEffect, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import PatientListItem from '../components/PatientListItem';
import { Context as AuthContext } from '../context/AuthContext';
import { Context as ImportContext } from '../context/ImportContext';
import { Context as PatientContext } from '../context/PatientContext';
import usePatient from '../hooks/usePatient';

const PatientListScreen = ({ navigation }) => {
  const {
    state: { currentUser },
  } = useContext(AuthContext);

  const {
    state: { list, searching },
    resetSearch,
  } = useContext(PatientContext);

  const { clear } = useContext(ImportContext);

  const { loadLogs, searchPatients } = usePatient();

  const [query, setQuery] = useState('');

  useEffect(() => {
    loadLogs(currentUser);
  }, []);

  const keyExtractor = (item) => item.id;

  const renderItem = ({ item }) => (
    <PatientListItem
      patient={item}
      onSelection={() => {
        clear();
        navigation.navigate('Detail', {
          patient: item,
        });
      }}
    ></PatientListItem>
  );

  const searchClearRequest = () => {
    if (!searching) {
      resetSearch();
    }
  };

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
        onClear={searchClearRequest}
        showLoading={searching}
        disabled={searching}
        clearIcon={{ size: searching ? 0 : 22 }}
        loadingProps={{ color: '#2089dc', size: 'small' }}
      />
      <FlatList
        keyExtractor={keyExtractor}
        data={list}
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
