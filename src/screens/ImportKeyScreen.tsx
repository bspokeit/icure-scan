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

interface Props extends NavigationSwitchScreenProps {}

const ImportKeyScreen: NavigationSwitchScreenComponent<Props> = ({
  navigation,
}) => {
  const {
    state: { currentHcp, parentHcp },
  } = useContext(AuthContext);
  const {
    state: { keys, keyImports },
    importPrivateKeysFromStorage,
  } = useContext(CryptoContext);

  const hcps = compact([currentHcp, parentHcp]);

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
    <SafeAreaView style={styles.container}>
      {currentHcp ? (
        <KeyImporter
          hcp={currentHcp}
          headerText="User private key"
          loadedText="Your key is imported !"
          buttonText="Select your key"
        ></KeyImporter>
      ) : null}

      {parentHcp ? (
        <KeyImporter
          hcp={parentHcp}
          headerText="Parent private key"
          loadedText="Your parent key is imported !"
          buttonText="Select your parent key"
        ></KeyImporter>
      ) : null}
    </SafeAreaView>
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
    marginBottom: 100,
  },
});

export default ImportKeyScreen;
