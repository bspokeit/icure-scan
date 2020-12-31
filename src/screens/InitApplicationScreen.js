import { Ionicons } from '@expo/vector-icons';
import React, { useContext, useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-elements';
import Spacer from '../components/Spacer';
import { Context as AuthContext } from '../context/AuthContext';
import { Context as SystemContext } from '../context/SystemContext';

const InitApplicationScreen = () => {
  const {
    state: { systemReady, cryptoReady, storeReady, checkCompleted },
    checkSystem,
  } = useContext(SystemContext);
  const { autoLogin } = useContext(AuthContext);

  useEffect(() => {
    checkSystem();
  }, []);

  useEffect(() => {
    if (systemReady) {
      setTimeout(() => {
        autoLogin();
      }, 250);
    }
  }, [systemReady]);

  return (
    <View style={styles.container}>
      {!checkCompleted ? (
        <ActivityIndicator animating color="#0000ff" size="large" />
      ) : null}

      {cryptoReady ? (
        <View style={styles.horizontal}>
          <Ionicons name="md-checkmark-circle" size={16} color="green" />
          <Text style={styles.text}>Crypto is ready!</Text>
        </View>
      ) : null}

      {checkCompleted && !cryptoReady ? (
        <View style={styles.horizontal}>
          <Ionicons name="alert-circle" size={16} color="red" />
          <Text style={styles.text}>Crypto is not properly configured!</Text>
        </View>
      ) : null}

      {storeReady ? (
        <View style={styles.horizontal}>
          <Ionicons name="md-checkmark-circle" size={16} color="green" />
          <Text style={styles.text}>Store is ready!</Text>
        </View>
      ) : null}

      {checkCompleted && !storeReady ? (
        <View style={styles.horizontal}>
          <Ionicons name="alert-circle" size={16} color="red" />
          <Text style={styles.text}>Store is not properly configured!</Text>
        </View>
      ) : null}

      {storeReady && cryptoReady ? (
        <Spacer>
          <View style={styles.horizontal}>
            <ActivityIndicator animating color="#0000ff" size="small" />
            <Text style={styles.text}>Attempting to log you in...</Text>
          </View>
        </Spacer>
      ) : null}
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
    marginBottom: 150,
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    marginLeft: 8,
  },
  horizontal: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 10,
  },
});

export default InitApplicationScreen;
