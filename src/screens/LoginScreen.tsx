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

import { Card } from '@rneui/base';
import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationSwitchScreenComponent, NavigationSwitchScreenProps } from 'react-navigation';
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
