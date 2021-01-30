import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Input, Text } from 'react-native-elements';
import { Credentials } from '../api/icure';

interface Props {
  errorMessage?: string;
  onSubmit: (_: Credentials) => void;
  submitButtonText: string;
  loginOngoing: boolean;
  disabled: boolean;
}

const LoginForm: React.FC<Props> = ({
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
    <>
      <Input
        label="Username"
        labelStyle={styles.labelStyle}
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        autoCorrect={false}
        onSubmitEditing={tryToSubmit}
      />
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
      <Button
        style={styles.submitButton}
        title={submitButtonText}
        onPress={() => onSubmit({ username, password })}
        disabled={disabled || !username || !password || loginOngoing}
        loading={loginOngoing}
      />
    </>
  );
};

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
  },
  labelStyle: {
    color: '#2089dc',
    margin: 15,
    fontSize: 16,
  },
  submitButton: {
    margin: 15,
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
