/*
 * Copyright (C) 2022 Bspoke IT SRL
 *
 * This file is part of icure-scan.
 *
 * icure-scan is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * icure-scan is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with icure-scan.  If not, see <http://www.gnu.org/licenses/>.
 */

import { Button, Input, Text } from '@rneui/base';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Credentials } from '../api/icure';
import { DEFAULT_BORDER, MAIN_ACTION, MAIN_COLOR, SECONDARY_ACTION } from '../constant';

interface Props {
  errorMessage?: string;
  onSubmit: (_: Credentials) => void;
  submitButtonText: string;
  loginOngoing: boolean;
  disabled: boolean;
}

const LoginForm: React.FC<Props> = ({ errorMessage, onSubmit, submitButtonText, loginOngoing, disabled }) => {
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
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        </View>
      ) : null}
      <Button
        title={submitButtonText}
        onPress={() => onSubmit({ username, password })}
        disabled={disabled || !username || !password || loginOngoing}
        loading={loginOngoing}
        buttonStyle={styles.submitButton}
      />
    </>
  );
};

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
  },
  labelStyle: {
    color: MAIN_COLOR,
  },
  submitButton: {
    borderRadius: DEFAULT_BORDER,
    color: MAIN_ACTION,
    backgroundColor: MAIN_ACTION,
  },
  errorMessage: {
    alignItems: 'center',
    fontSize: 16,
    color: SECONDARY_ACTION,
    marginLeft: 15,
    marginBottom: 15,
  },
});

export default LoginForm;
