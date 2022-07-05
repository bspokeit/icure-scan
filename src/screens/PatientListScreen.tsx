/*
 * Copyright (C) 2022 Bspoke IT SRL
 *
 * This file is part of icure-scan.
 *
 * icure-scan is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * icure-scan is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with icure-scan.  If not, see <http://www.gnu.org/licenses/>.
 */
import { BottomSheet, SearchBar } from '@rneui/base';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  NavigationStackScreenComponent,
  NavigationStackScreenProps
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
    state: {currentUser},
  } = useContext(AuthContext);

  const {
    state: {list, searching},
    resetSearch,
  } = useContext(PatientContext);

  const {clear} = useContext(ImportContext);

  const {loadLogs, searchPatients} = usePatient();

  useEffect(() => {
    loadLogs(currentUser!!);
  }, []);

  const [settingVisible, setSettingVisible] = useState(false);

  const keyExtractor = useCallback((item: Patient) => item.id, []);

  const renderItem = useCallback(
    ({item}: {item: Patient}) => (
      <PatientListItem
        patient={item}
        onSelection={() => {
          clear();
          navigation.navigate('Detail', {
            patient: item,
          });
        }}></PatientListItem>
    ),
    [],
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
          <Icon name="settings" color={MAIN_COLOR} size={20} />
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
        clearIcon={{color: MAIN_COLOR, size: searching ? 0 : 20}}
        loadingProps={{color: MAIN_COLOR, size: 'small'}}
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
        modalProps={{}}>
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
  searchInput: {backgroundColor: 'white', borderRadius: DEFAULT_BORDER},
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
