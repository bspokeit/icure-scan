import { getDocumentAsync } from 'expo-document-picker';
import * as FS from 'expo-file-system';
import React, { useContext } from 'react';
import { View } from 'react-native';
import { Button, Text } from 'react-native-elements';
import { Context as CryptoContext } from '../context/CryptoContext';

const KeyImporter = ({ hcp, loadingText, buttonText, loadedText }) => {
  const {
    state: { keys, keyImports },
    importPrivateKey,
  } = useContext(CryptoContext);

  const onImportPress = () => {
    getDocumentAsync()
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

  if (!hcp) {
    return;
  }

  if (keyImports[hcp.id]) {
    return <Text>{loadingText}</Text>;
  }

  return (
    <View>
      {!keys[hcp.id] ? (
        <Button title={buttonText} onPress={onImportPress} />
      ) : (
        <Text>{loadedText}</Text>
      )}

      <Text>Hcp key: ...{keys[hcp.id]?.substr(-25)}</Text>
    </View>
  );
};

export default KeyImporter;
