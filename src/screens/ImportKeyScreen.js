import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, Button } from 'react-native-elements';
import { getDocumentAsync } from 'expo-document-picker';
import * as FS from 'expo-file-system';
import { Context as AuthContext } from '../context/AuthContext';
import iCureAPI from '../api/icure';
import * as SecureStore from 'expo-secure-store';

const ImportKeyScreen = () => {
  const { state } = useContext(AuthContext);
  const onImportPress = (hcpId) => {
    getDocumentAsync({
      multiple: false,
    })
      .then((result) => {
        if (result.type === 'success') {
          return FS.readAsStringAsync(result.uri);
        }
      })
      .then((fileContent) => {
        if (fileContent) {
          return iCureAPI
            .getCryptoAPI()
            .loadKeyPairsAsTextInBrowserLocalStorage(
              hcpId,
              iCureAPI.getCryptoAPI().utils.hex2ua(fileContent)
            )
            .then(() => {
              return SecureStore.setItemAsync(hcpId + '-key', fileContent);
            });
        }
      })
      .catch((err) => {
        console.log('BAM!!!!');
        console.log(err);
      });
  };

  return (
    <View style={styles.container}>
      <Text>Import Key Screen</Text>
      <Button
        title="Import your key"
        onPress={() => {
          onImportPress(state.currentHcp.id);
        }}
      />
      {state.parentHcp ? (
        <Button
          title="Import parent key"
          onPress={() => {
            onImportPress(state.parentHcp.id);
          }}
        />
      ) : null}
    </View>
  );
};

ImportKeyScreen.navigationOptions = () => {
  return {
    headerShown: false,
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: 250,
  },
});

export default ImportKeyScreen;
