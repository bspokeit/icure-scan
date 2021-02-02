import { Ionicons } from '@expo/vector-icons';
import { getDocumentAsync } from 'expo-document-picker';
import * as FS from 'expo-file-system';
import React, { useCallback, useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Card, Text } from 'react-native-elements';
import { DEFAULT_BORDER, MAIN_ACTION, MAIN_COLOR } from '../constant';
import { Context as CryptoContext } from '../context/CryptoContext';
import useCrypto from '../hooks/useCrypto';
import { HealthcareParty } from '../models';

interface Props {
  hcp: HealthcareParty;
  headerText: string;
  buttonText: string;
  loadedText: string;
}

const KeyImporter: React.FC<Props> = ({
  hcp,
  headerText,
  buttonText,
  loadedText,
}) => {
  const {
    state: { keys, keyImports },
  } = useContext(CryptoContext);

  const { importPrivateKey } = useCrypto();

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

  const importIsGoing = useCallback(() => {
    return !!Object.values(keyImports || {}).find((ongoing) => ongoing);
  }, [keyImports]);

  return (
    <View style={styles.container}>
      <Card containerStyle={styles.card}>
        <Card.Title>
          <Text style={styles.text}>{headerText}</Text>
        </Card.Title>
        <Card.Divider style={{ backgroundColor: MAIN_COLOR, margin: 5 }} />
        <View style={styles.center}>
          {!hcp ? (
            <View>
              <Text style={styles.text}>No Hcp has been detected...</Text>
            </View>
          ) : (
            <View>
              <Text style={styles.text}>{hcp.id}</Text>
            </View>
          )}
        </View>

        <Card.Divider style={{ backgroundColor: MAIN_COLOR, margin: 5 }} />
        <View>
          {!keys[hcp.id] ? (
            <Button
              title={buttonText}
              onPress={onImportPress}
              loading={keyImports[hcp.id]}
              disabled={importIsGoing()}
              buttonStyle={styles.uploadButton}
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
                <Text style={styles.text}>{loadedText}</Text>
              </View>
            </View>
          )}
        </View>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: '90%' },
  card: {
    borderWidth: 1,
    borderColor: MAIN_COLOR,
    borderRadius: DEFAULT_BORDER,
    justifyContent: 'center',
    textAlignVertical: 'center',
    alignContent: 'center',
  },
  contentText: {
    marginBottom: 15,
  },
  textIcon: {
    marginRight: 8,
  },
  text: {
    color: MAIN_COLOR,
  },
  center: {
    alignItems: 'center',
  },
  horizontal: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  uploadButton: {
    borderRadius: DEFAULT_BORDER,
    color: MAIN_ACTION,
    backgroundColor: MAIN_ACTION,
  },
});

export default KeyImporter;
