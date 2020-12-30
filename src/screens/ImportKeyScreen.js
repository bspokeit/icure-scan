import React, { useContext, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import KeyImporter from '../components/KeyImporter';
import { Context as AuthContext } from '../context/AuthContext';
import { Context as CryptoContext } from '../context/CryptoContext';

const ImportKeyScreen = () => {
  const {
    state: { currentHcp, parentHcp },
  } = useContext(AuthContext);
  const { importPrivateKeysFromStorage } = useContext(CryptoContext);

  useEffect(() => {
    async function automaticKeyLoading() {
      await importPrivateKeysFromStorage([currentHcp, parentHcp]);
    }

    automaticKeyLoading();
  }, []);

  return (
    <View style={styles.container}>
      {currentHcp ? (
        <KeyImporter
          hcp={currentHcp}
          loadingText="Importing your key"
          loadedText="Your key is imported !"
          buttonText="Select your key"
        ></KeyImporter>
      ) : null}

      {parentHcp ? (
        <KeyImporter
          hcp={parentHcp}
          loadingText="Importing your parent key"
          loadedText="Your parent key is imported !"
          buttonText="Select your parent key"
        ></KeyImporter>
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
