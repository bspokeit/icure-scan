import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Input, Text } from 'react-native-elements';
import Spacer from './Spacer';

const LoginForm = ({
  errorMessage,
  onSubmit,
  submitButtonText,
  loginOngoing,
  disabled,
}) => {
  const [username, setUsername] = useState('demo-test-1608210888');
  const [password, setPassword] = useState('test');

  const tryToSubmit = () => {
    if (username && password) {
      onSubmit({ username, password });
    }
  };

  return (
    <View style={styles.container}>
      <Input
        label="Username"
        labelStyle={styles.labelStyle}
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        autoCorrect={false}
        onSubmitEditing={tryToSubmit}
      />
      <Spacer />
      <Input
        secureTextEntry
        label="Password"
        labelStyle={styles.labelStyle}
        value={password}
        onChangeText={setPassword}
        autoCapitalize="none"
        autoCorrect={false}
        onSubmitEditing={tryToSubmit}
      />
      {errorMessage ? (
        <View style={styles.center}>
          <Text style={styles.errorMessage}>I'm an error{errorMessage}</Text>
        </View>
      ) : null}
      <Spacer>
        <Button
          title={submitButtonText}
          onPress={() => onSubmit({ username, password })}
          disabled={disabled || !username || !password || loginOngoing}
          loading={loginOngoing}
        />
      </Spacer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    fontSize: 16,
  },
  center: {
    alignItems: 'center',
  },
  labelStyle: {
    color: '#2089dc',
  },
  errorMessage: {
    alignItems: 'center',
    fontSize: 16,
    color: '#ff190c',
    marginLeft: 15,
    marginBottom: 15,
  },
});

export default LoginForm;
