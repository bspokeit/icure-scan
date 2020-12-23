import React, { useContext, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-elements';
import { Context as ICureContext } from '../context/IcureContext';

const InitApplicationScreen = () => {
  const { initCrypto } = useContext(ICureContext);

  useEffect(() => {
    initCrypto();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Application init</Text>
    </View>
  );
};

InitApplicationScreen.navigationOptions = () => {
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

export default InitApplicationScreen;
