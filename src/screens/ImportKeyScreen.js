import { getDocumentAsync } from 'expo-document-picker';
import * as FS from 'expo-file-system';
import React, { useContext, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-elements';
import iCureAPI from '../api/icure';
import { Context as AuthContext } from '../context/AuthContext';
import { Context as CryptoContext } from '../context/CryptoContext';

const ImportKeyScreen = () => {
  const {
    state: { currentHcp, parentHcp },
  } = useContext(AuthContext);
  const {
    state: { keys },
    loadPrivateKeyToStorage,
    loadPrivateKeyFromStorage,
    loadPrivateKeysFromStorage,
  } = useContext(CryptoContext);

  useEffect(() => {
    console.log('Current HCP: ', !!currentHcp);
    console.log('Parent HCP: ', !!parentHcp);

    async function automaticKeyLoading() {
      await loadPrivateKeysFromStorage([currentHcp, parentHcp]);
    }

    automaticKeyLoading();
  }, []);

  const onImportPress = (hcpId) => {
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
          return iCureAPI
            .getCryptoAPI()
            .loadKeyPairsAsTextInBrowserLocalStorage(
              hcpId,
              iCureAPI.getCryptoAPI().utils.hex2ua(privateKey)
            )
            .then(() => {
              return loadPrivateKeyToStorage(hcpId, privateKey);
            });
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
          onImportPress(currentHcp.id);
        }}
      />
      {parentHcp ? (
        <Button
          title="Import parent key"
          onPress={() => {
            onImportPress(parentHcp.id);
          }}
        />
      ) : null}

      {currentHcp ? (
        <Text>Current key: ...{keys[currentHcp.id]?.substr(-23)}</Text>
      ) : null}
      {parentHcp ? (
        <Text>Parent key: ...{keys[parentHcp.id]?.substr(-23)}</Text>
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
