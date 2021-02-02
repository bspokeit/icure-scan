import React, { useCallback, useContext, useEffect, useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { BottomSheet, Icon, SearchBar } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  NavigationStackScreenComponent,
  NavigationStackScreenProps,
} from 'react-navigation-stack';
import PatientListItem from '../components/PatientListItem';
import Settings from '../components/Settings';
import { DEFAULT_BORDER, MAIN_COLOR } from '../constant';
import { Context as AuthContext } from '../context/AuthContext';
import { Context as ImportContext } from '../context/ImportContext';
import { Context as PatientContext } from '../context/PatientContext';
import usePatient from '../hooks/usePatient';
import { Patient } from '../models';

interface Props extends NavigationStackScreenProps {}

const PatientListScreen: NavigationStackScreenComponent<Props> = ({
  navigation,
}) => {
  const [query, setQuery] = useState('');

  const {
    state: { currentUser },
  } = useContext(AuthContext);

  const {
    state: { list, searching },
    resetSearch,
  } = useContext(PatientContext);

  const { clear } = useContext(ImportContext);

  const { loadLogs, searchPatients } = usePatient();

  useEffect(() => {
    loadLogs(currentUser!!);
  }, []);

  const [settingVisible, setSettingVisible] = useState(false);

  const keyExtractor = useCallback((item: Patient) => item.id, []);

  const renderItem = useCallback(
    ({ item }: { item: Patient }) => (
      <PatientListItem
        patient={item}
        onSelection={() => {
          clear();
          navigation.navigate('Detail', {
            patient: item,
          });
        }}
      ></PatientListItem>
    ),
    []
  );

  const searchClearRequest = () => {
    if (!searching) {
      resetSearch();
    }
  };

  const renderSearchIcon = () => {
    return (
      <View>
        <TouchableOpacity onPress={() => setSettingVisible(!settingVisible)}>
          <Icon name="settings" type="ionicons" color={MAIN_COLOR} size={20} />
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
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
        loadingProps={{ color: MAIN_COLOR, size: 'small' }}
        containerStyle={styles.searchContainer}
        inputContainerStyle={styles.searchInput}
        searchIcon={renderSearchIcon()}
      />
      <FlatList
        keyExtractor={keyExtractor}
        data={list}
        renderItem={renderItem}
      />
      <BottomSheet
        isVisible={settingVisible}
        containerStyle={styles.bottomSheetContainer}
        modalProps={{}}
      >
        <Settings onCancel={() => setSettingVisible(false)} />
      </BottomSheet>
    </SafeAreaView>
  );
};

PatientListScreen.navigationOptions = () => {
  return {
    headerShown: false,
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 8,
  },
  searchContainer: {
    backgroundColor: 'transparent',
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
  },
  searchInput: { backgroundColor: 'white', borderRadius: DEFAULT_BORDER },
  bottomSheetContainer: {
    flex: 1,
    width: '100%',
  },
  settingItemContainer: {
    height: 50,
    width: '100%',
    backgroundColor: 'transparent',
  },
});

export default PatientListScreen;
