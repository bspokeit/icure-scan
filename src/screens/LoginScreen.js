import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import LoginForm from '../components/LoginForm';
import { Context as AuthContext } from '../context/AuthContext';

const LoginScreen = () => {
  const { state, login } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <LoginForm
        errorMessage={state.errorMessage}
        onSubmit={login}
        submitButtonText={!!state.authHeader ? 'You are logged in!' : 'Log in'}
        loginOngoing={state.loginOngoing && !state.authHeader}
        disabled={!!state.authHeader}
      />
    </View>
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
