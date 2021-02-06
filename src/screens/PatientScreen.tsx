/*
 * Copyright (C) 2021 Bspoke IT SRL
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

import React, { useContext, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  NavigationStackScreenComponent,
  NavigationStackScreenProps,
} from 'react-navigation-stack';
import ContactList from '../components/ContactList';
import PatientHeader from '../components/PatientHeader';
import { DEFAULT_BORDER, MAIN_ACTION } from '../constant';
import { Context as PatientContext } from '../context/PatientContext';
import useContact from '../hooks/useContact';
import { Patient } from '../models';

interface Props extends NavigationStackScreenProps {}

const PatientScreen: NavigationStackScreenComponent<Props> = ({
  navigation,
}) => {
  const patient: Patient = navigation.state.params?.patient;
  const { fetchContacts } = useContact();

  const {
    state: { contacts },
  } = useContext(PatientContext);

  useEffect(() => {
    fetchContacts(patient);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <PatientHeader
          patient={patient}
          goBack={() => navigation.goBack()}
          subTitle={
            contacts && contacts[patient.id] && contacts[patient.id].length
              ? `${contacts[patient.id].length} contact(s)`
              : undefined
          }
        ></PatientHeader>
      </View>
      <View>
        <ContactList patient={patient}></ContactList>
      </View>
      <View style={styles.actionButtonBlock}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            navigation.navigate('Import', { patient });
          }}
        >
          <Icon reverse raised name="add" type="ionicon" color={MAIN_ACTION} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

PatientScreen.navigationOptions = () => {
  return {
    headerShown: false,
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 8,
  },
  header: {
    height: 50,
    margin: 8,
    marginTop: 8,
    backgroundColor: 'white',
    borderRadius: DEFAULT_BORDER,
  },
  actionButtonBlock: {
    position: 'absolute',
    height: 80,
    width: 100,
    right: 0,
    bottom: 0,
  },
});

export default PatientScreen;
