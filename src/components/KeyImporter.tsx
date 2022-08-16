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

import { Button, Card, Text } from '@rneui/base';
import React, { useCallback, useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import * as FS from 'react-native-fs';
import Icon from 'react-native-vector-icons/Ionicons';
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

const KeyImporter: React.FC<Props> = ({ hcp, headerText, buttonText, loadedText }) => {
  const {
    state: { keys, keyImports },
  } = useContext(CryptoContext);

  const { importPrivateKey } = useCrypto();

  const onImportPress = async () => {
    try {
      const pickerResult = await DocumentPicker.pickSingle({
        presentationStyle: 'fullScreen',
      });

      const privateKey = await FS.readFile(pickerResult.uri, 'utf8');

      await importPrivateKey(hcp, privateKey);
    } catch (error) {
      console.error(error);
    }
  };

  const importIsGoing = useCallback(() => {
    return !!Object.values(keyImports || {}).find(ongoing => ongoing);
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
                <Icon style={styles.textIcon} name="md-checkmark-circle" size={16} color="green" />
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
