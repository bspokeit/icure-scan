import { Ionicons } from '@expo/vector-icons';
import React, { useContext, useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  NavigationSwitchScreenComponent,
  NavigationSwitchScreenProps,
} from 'react-navigation';
import Spacer from '../components/Spacer';
import { Context as AuthContext } from '../context/AuthContext';
import { Context as SystemContext } from '../context/SystemContext';
import useSystem from '../hooks/useSystem';

interface Props extends NavigationSwitchScreenProps {}

const InitApplicationScreen: NavigationSwitchScreenComponent<Props> = () => {
  const {
    state: { systemReady, cryptoReady, storeReady, checkCompleted },
  } = useContext(SystemContext);
  const { autoLogin } = useContext(AuthContext);

  const { checkSystem } = useSystem();

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
    <SafeAreaView style={styles.container}>
      {!checkCompleted ? (
        <ActivityIndicator animating color="#2089dc" size="large" />
      ) : null}

      {cryptoReady ? (
        <View style={styles.horizontal}>
          <Ionicons
            style={styles.textIcon}
            name="md-checkmark-circle"
            size={16}
            color="green"
          />
          <Text>Crypto is ready!</Text>
        </View>
      ) : null}

      {checkCompleted && !cryptoReady ? (
        <View style={styles.horizontal}>
          <Ionicons
            style={styles.textIcon}
            name="alert-circle"
            size={16}
            color="red"
          />
          <Text>Crypto is not properly configured!</Text>
        </View>
      ) : null}

      {storeReady ? (
        <View style={styles.horizontal}>
          <Ionicons
            style={styles.textIcon}
            name="md-checkmark-circle"
            size={16}
            color="green"
          />
          <Text>Store is ready!</Text>
        </View>
      ) : null}

      {checkCompleted && !storeReady ? (
        <View style={styles.horizontal}>
          <Ionicons
            style={styles.textIcon}
            name="alert-circle"
            size={16}
            color="red"
          />
          <Text>Store is not properly configured!</Text>
        </View>
      ) : null}

      {storeReady && cryptoReady ? (
        <Spacer>
          <View style={styles.horizontal}>
            <ActivityIndicator
              style={styles.textIcon}
              animating
              color="#2089dc"
              size="small"
            />
            <Text>Attempting to log you in...</Text>
          </View>
        </Spacer>
      ) : null}
    </SafeAreaView>
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
  textIcon: {
    marginRight: 8,
  },
  horizontal: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 10,
  },
});

export default InitApplicationScreen;
