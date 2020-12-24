import React, { useContext, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-elements';
import { Context as SystemContext } from '../context/SystemContext';
import { Context as AuthContext } from '../context/AuthContext';

const InitApplicationScreen = () => {
  const { checkSystem } = useContext(SystemContext);
  const { autoLogin } = useContext(AuthContext);

  useEffect(() => {
    checkSystem().then(() => {
      autoLogin();
    });
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
