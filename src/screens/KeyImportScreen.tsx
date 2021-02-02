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
