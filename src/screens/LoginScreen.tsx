import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  NavigationSwitchScreenComponent,
  NavigationSwitchScreenProps,
} from 'react-navigation';
import LoginForm from '../components/LoginForm';
import { Context as AuthContext } from '../context/AuthContext';
import useAuth from '../hooks/useAuth';

interface Props extends NavigationSwitchScreenProps {}

const LoginScreen: NavigationSwitchScreenComponent<Props> = () => {
  const {
    state: { error, authHeader, ongoing },
  } = useContext(AuthContext);
  const { login } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <LoginForm
        errorMessage={error}
        onSubmit={login}
        submitButtonText={!!authHeader ? 'You are logged in!' : 'Log in'}
        loginOngoing={!!ongoing && !authHeader}
        disabled={!!authHeader}
      />
    </SafeAreaView>
  );
};

LoginScreen.navigationOptions = {
  header: () => false,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: 150,
  },
});

export default LoginScreen;
