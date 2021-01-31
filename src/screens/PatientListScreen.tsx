import React, { useContext, useEffect, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  NavigationStackScreenComponent,
  NavigationStackScreenProps,
} from 'react-navigation-stack';
import PatientListItem from '../components/PatientListItem';
import { GREY } from '../constant';
import { Context as AuthContext } from '../context/AuthContext';
import { Context as ImportContext } from '../context/ImportContext';
import { Context as PatientContext } from '../context/PatientContext';
import usePatient from '../hooks/usePatient';
import { Patient } from '../models';

interface Props extends NavigationStackScreenProps {}

const PatientListScreen: NavigationStackScreenComponent<Props> = ({
  navigation,
}) => {
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
    loadLogs(currentUser!!);
  }, []);

  const keyExtractor = (item: Patient) => item.id;

  const renderItem = ({ item }: { item: Patient }) => (
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
        placeholder="Search patient..."
        lightTheme
        value={query}
        onChangeText={setQuery}
        autoCapitalize="none"
        autoCorrect={false}
        onEndEditing={() => searchPatients(currentUser!!, query)}
        onClear={searchClearRequest}
        showLoading={searching}
        disabled={searching}
        clearIcon={{ size: searching ? 0 : 22 }}
        loadingProps={{ color: GREY, size: 'small' }}
        containerStyle={styles.searchContainer}
        inputContainerStyle={styles.searchInput}
        searchIcon={{ color: GREY }}
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
  searchContainer: {
    backgroundColor: 'transparent',
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
  },
  searchInput: { backgroundColor: 'white', borderRadius: 8 },
});

export default PatientListScreen;
