import React, { useContext, useEffect, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { Avatar, ListItem, SearchBar } from 'react-native-elements';
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
    // loadAccessLogs(currentUser);
  }, []);

  const keyExtractor = (item) => item.id;

  const renderItem = ({ item }) => (
    <ListItem bottomDivider>
      {item.picture ? (
        <Avatar
          rounded
          source={{
            uri: `data:image/jpeg;base64,${btoa(
              String.fromCharCode(...new Uint8Array(item.picture))
            )}`,
          }}
          size="medium"
        />
      ) : (
        <Avatar
          rounded
          size="medium"
          icon={{
            name: 'user-circle',
            type: 'font-awesome',
            size: 32,
            color: 'grey',
          }}
        />
      )}
      <ListItem.Content>
        <ListItem.Title>{`${item.firstName} ${item.lastName}`}</ListItem.Title>
        <ListItem.Subtitle>{item.subtitle}</ListItem.Subtitle>
      </ListItem.Content>
      <ListItem.Chevron />
    </ListItem>
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

const styles = StyleSheet.create({});

export default PatientListScreen;
