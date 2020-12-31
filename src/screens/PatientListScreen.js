import React, { useContext, useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { Context as AuthContext } from '../context/AuthContext';
import { Context as PatientContext } from '../context/PatientContext';

const PatientListScreen = () => {
  const {
    state: { currentUser },
  } = useContext(AuthContext);

  const {
    state: { patientList },
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
    <View>
      <SearchBar
        placeholder="Search here..."
        value={query}
        onChangeText={setQuery}
        autoCapitalize="none"
        autoCorrect={false}
        onEndEditing={() => searchPatients(currentUser, query)}
        onClear={() => console.log('Search cleared')}
      />
      <FlatList
        data={patientList}
        renderItem={({ item }) => (
          <Item content={`${item.firstName} ${item.lastName}`} />
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({});

export default PatientListScreen;
