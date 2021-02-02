import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { Card } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  NavigationSwitchScreenComponent,
  NavigationSwitchScreenProps,
} from 'react-navigation';
import LoginForm from '../components/LoginForm';
import { DEFAULT_BORDER, MAIN_COLOR } from '../constant';
import { Context as AuthContext } from '../context/AuthContext';
import useAuth from '../hooks/useAuth';

interface Props extends NavigationSwitchScreenProps {}

const LoginScreen: NavigationSwitchScreenComponent<Props> = () => {
  const {
    state: { error, authHeader, ongoing },
  } = useContext(AuthContext);
  const { login } = useAuth();

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.container}>
        <Card containerStyle={styles.card}>
          <LoginForm
            errorMessage={error}
            onSubmit={login}
            submitButtonText={!!authHeader ? 'You are logged in!' : 'Log in'}
            loginOngoing={!!ongoing && !authHeader}
            disabled={!!authHeader}
          />
        </Card>
      </View>
    </SafeAreaView>
  );
};

LoginScreen.navigationOptions = {
  header: () => false,
};

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  container: { width: '90%' },
  card: {
    borderWidth: 1,
    borderColor: MAIN_COLOR,
    borderRadius: DEFAULT_BORDER,
    justifyContent: 'center',
    textAlignVertical: 'center',
    alignContent: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
});

export default LoginScreen;
