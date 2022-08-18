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

import { Card, Text } from '@rneui/base';
import React, { useContext, useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import { NavigationSwitchScreenComponent, NavigationSwitchScreenProps } from 'react-navigation';
import { DEFAULT_BORDER, MAIN_COLOR, SECONDARY_ACTION } from '../constant';
import { SystemCheckStatus } from '../context/reducer-action/SystemReducerActions';
import { Context as SystemContext } from '../context/SystemContext';
import useAuth from '../hooks/useAuth';
import useSystem from '../hooks/useSystem';

interface Props extends NavigationSwitchScreenProps {}

const ApplicationInitScreen: NavigationSwitchScreenComponent<Props> = () => {
  const {
    state: { checkCompleted, systemChecks },
  } = useContext(SystemContext);
  const { checkSystem, systemIsReady } = useSystem();

  const { autoLogin } = useAuth();

  useEffect(() => {
    checkSystem();
  }, []);

  useEffect(() => {
    if (systemIsReady()) {
      setTimeout(() => {
        autoLogin();
      }, 350);
    }
  }, [checkCompleted]);

  if (!checkCompleted || systemIsReady()) {
    return (
      <SafeAreaView style={styles.safeAreaView}>
        <View style={styles.container}>
          <Card containerStyle={styles.card}>
            <View style={styles.horizontal}>
              <ActivityIndicator style={styles.textIcon} animating color={MAIN_COLOR} size="small" />
              <Text style={styles.text}>{!checkCompleted ? 'Checking system...' : 'Automatic login...'}</Text>
            </View>
          </Card>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.container}>
        <Card containerStyle={styles.card}>
          {systemChecks
            .filter(c => c.status === SystemCheckStatus.Error || true)
            .map((c, i) => (
              <View key={i} style={styles.horizontal}>
                <Icon style={styles.textIcon} name="alert-circle" color={SECONDARY_ACTION} />
                <Text style={styles.text}>{c.errorMessage}</Text>
              </View>
            ))}
        </Card>
      </View>
    </SafeAreaView>
  );
};

ApplicationInitScreen.navigationOptions = () => {
  return {
    headerShown: false,
  };
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
  },
  textIcon: {
    marginRight: 8,
  },
  text: {
    color: MAIN_COLOR,
  },
  horizontal: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default ApplicationInitScreen;
