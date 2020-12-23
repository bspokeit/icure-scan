import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import LoginForm from '../components/LoginForm';
import { Context as AuthContext } from '../context/AuthContext';

const LoginScreen = () => {
  const { state, login } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <LoginForm
        headerText="Log in"
        errorMessage={state.errorMessage}
        onSubmit={login}
        submitButtonText="Log in"
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
    marginBottom: 250,
  },
});

export default LoginScreen;
