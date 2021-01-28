import { Ionicons } from '@expo/vector-icons';
import { getDocumentAsync } from 'expo-document-picker';
import * as FS from 'expo-file-system';
import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Card, Text } from 'react-native-elements';
import { Context as CryptoContext } from '../context/CryptoContext';

const KeyImporter = ({ hcp, headerText, buttonText, loadedText }) => {
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
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <View>
      <Card>
        <Card.Title>
          <Text>{headerText}</Text>
        </Card.Title>
        <Card.Divider />
        <View style={styles.center}>
          {!hcp ? (
            <View>
              <Text style={styles.contentText}>
                No Hcp has been detected...
              </Text>
            </View>
          ) : (
            <View>
              <Text style={styles.contentText}>{hcp.id}</Text>
            </View>
          )}
        </View>

        <Card.Divider />
        <View>
          {!keys[hcp.id] ? (
            <Button
              title={buttonText}
              onPress={onImportPress}
              loading={keyImports[hcp.id]}
              disabled={keyImports[hcp.id]}
            />
          ) : (
            <View style={styles.center}>
              <View style={styles.horizontal}>
                <Ionicons
                  style={styles.textIcon}
                  name="md-checkmark-circle"
                  size={16}
                  color="green"
                />
                <Text>{loadedText}</Text>
              </View>
            </View>
          )}
        </View>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  contentText: {
    marginBottom: 15,
  },
  textIcon: {
    marginRight: 8,
  },
  center: {
    alignItems: 'center',
  },
  horizontal: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default KeyImporter;
