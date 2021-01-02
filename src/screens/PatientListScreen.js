import React, { useContext, useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
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
  } = useContext(PatientContext);
  

  const [query, setQuery] = useState('');

  useEffect(() => {
    loadAccessLogs(currentUser);
  }, []);

  const Item = ({ content }) => (
    <View style={styles.item}>
      <Text style={styles.content}>{content}</Text>
    </View>
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
        onClear={() => console.log('Search cleared')}
        showLoading={searching}
        loadingProps={{ color: '#2089dc', size: 'small' }}
      />
      <FlatList
        data={patientList}
        renderItem={({ item }) => (
          <Item content={`${item.firstName} ${item.lastName}`} />
        )}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
};

PatientListScreen.navigationOptions = () => {
  return {
    headerShown: false,
  };
};

const styles = StyleSheet.create({});

export default PatientListScreen;
