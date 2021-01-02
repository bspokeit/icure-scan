import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LoginForm from '../components/LoginForm';
import { Context as AuthContext } from '../context/AuthContext';

const LoginScreen = () => {
  const { state, login } = useContext(AuthContext);

  return (
    <SafeAreaView style={styles.container}>
      <LoginForm
        errorMessage={state.errorMessage}
        onSubmit={login}
        submitButtonText={!!state.authHeader ? 'You are logged in!' : 'Log in'}
        loginOngoing={state.loginOngoing && !state.authHeader}
        disabled={!!state.authHeader}
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
