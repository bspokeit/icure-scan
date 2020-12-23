import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import LoginForm from '../components/LoginForm';
import { Context } from '../context/AuthContext';

const LoginScreen = () => {
  const { state } = useContext(Context);

  return (
    <View style={styles.container}>
      <LoginForm
        headerText="Log in"
        errorMessage={state.errorMessage}
        onSubmit={() => {}}
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
