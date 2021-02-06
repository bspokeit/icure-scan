/*
 * Copyright (C) 2021 Bspoke IT SRL
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

import { compact } from 'lodash';
import React, { useContext, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  NavigationSwitchScreenComponent,
  NavigationSwitchScreenProps,
} from 'react-navigation';
import KeyImporter from '../components/KeyImporter';
import { Context as AuthContext } from '../context/AuthContext';
import { Context as CryptoContext } from '../context/CryptoContext';
import useCrypto from '../hooks/useCrypto';

interface Props extends NavigationSwitchScreenProps {}

const KeyImportScreen: NavigationSwitchScreenComponent<Props> = ({
  navigation,
}) => {
  const {
    state: { currentHcp, currentParentHcp },
  } = useContext(AuthContext);
  const {
    state: { keys, keyImports },
  } = useContext(CryptoContext);

  const { importPrivateKeysFromStorage } = useCrypto();

  const hcps = compact([currentHcp, currentParentHcp]);

  const autoImports = hcps.map((hcp) => {
    return { id: hcp.id, imported: false };
  });

  useEffect(() => {
    (async () => {
      await importPrivateKeysFromStorage(hcps);
    })();
  }, []);

  useEffect(() => {
    autoImports.forEach((ai) => {
      ai.imported = !!keys[ai.id] && !keyImports[ai.id];
    });

    if (autoImports.every((ai) => ai.imported)) {
      navigation.navigate('List');
    }
  }, [keys, keyImports]);

  return (
    <SafeAreaView style={styles.safeAreaView}>
      {currentHcp ? (
        <KeyImporter
          hcp={currentHcp}
          headerText="User private key"
          loadedText="Your key is imported !"
          buttonText="Select your key"
        ></KeyImporter>
      ) : null}

      {currentParentHcp ? (
        <KeyImporter
          hcp={currentParentHcp}
          headerText="Parent private key"
          loadedText="Your parent key is imported !"
          buttonText="Select your parent key"
        ></KeyImporter>
      ) : null}
    </SafeAreaView>
  );
};

KeyImportScreen.navigationOptions = () => {
  return {
    headerShown: false,
  };
};

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
});

export default KeyImportScreen;
