import { getDocumentAsync } from 'expo-document-picker';
import * as FS from 'expo-file-system';
import React, { useContext, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-elements';
import { Context as AuthContext } from '../context/AuthContext';
import { Context as CryptoContext } from '../context/CryptoContext';

const ImportKeyScreen = () => {
  const {
    state: { currentHcp, parentHcp },
  } = useContext(AuthContext);
  const {
    state: { keys },
    importPrivateKey,
    importPrivateKeysFromStorage,
  } = useContext(CryptoContext);

  useEffect(() => {
    async function automaticKeyLoading() {
      await importPrivateKeysFromStorage([currentHcp, parentHcp]);
    }

    automaticKeyLoading();
  }, []);

  const onImportPress = (hcp) => {
    getDocumentAsync({
      multiple: false,
    })
      .then((result) => {
        if (result.type === 'success') {
          return FS.readAsStringAsync(result.uri);
        }
      })
      .then((privateKey) => {
        if (privateKey) {
          return importPrivateKey(hcp, privateKey);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <View style={styles.container}>
      <Text>Import Key Screen</Text>
      <Button
        title="Import your key"
        onPress={() => {
          onImportPress(currentHcp);
        }}
      />
      {parentHcp ? (
        <Button
          title="Import parent key"
          onPress={() => {
            onImportPress(parentHcp);
          }}
        />
      ) : null}

      {currentHcp ? (
        <Text>Current key: ...{keys[currentHcp.id]?.substr(-25)}</Text>
      ) : null}
      {parentHcp ? (
        <Text>Parent key: ...{keys[parentHcp.id]?.substr(-25)}</Text>
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
