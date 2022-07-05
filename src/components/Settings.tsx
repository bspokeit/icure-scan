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

import { ListItem } from '@rneui/base';
import React from 'react';
import { StyleSheet } from 'react-native';
import {
  DEFAULT_BORDER,
  LIGHT_GREY,
  MAIN_COLOR,
  SECONDARY_ACTION
} from '../constant';
import useAuth from '../hooks/useAuth';

interface Props {
  onCancel: () => void;
}

const Settings: React.FC<Props> = ({onCancel}) => {
  const {logUserOut, logoutUserOutHard} = useAuth();

  const onLogout = async () => {
    await logUserOut();
  };

  const onLogoutHard = async () => {
    await logoutUserOutHard();
  };

  return (
    <>
      <ListItem
        key={1}
        underlayColor={LIGHT_GREY}
        containerStyle={styles.settingItem}
        onPress={onLogout}>
        <ListItem.Content style={styles.settingItemContent}>
          <ListItem.Title
            style={[styles.settingItemTitle, {color: MAIN_COLOR}]}>
            Logout
          </ListItem.Title>
        </ListItem.Content>
      </ListItem>
      <ListItem
        key={2}
        underlayColor={LIGHT_GREY}
        containerStyle={styles.settingItem}
        onPress={onLogoutHard}>
        <ListItem.Content style={styles.settingItemContent}>
          <ListItem.Title
            style={[styles.settingItemTitle, {color: SECONDARY_ACTION}]}>
            Logout and clear key(s)
          </ListItem.Title>
        </ListItem.Content>
      </ListItem>
      <ListItem
        key={3}
        underlayColor={LIGHT_GREY}
        containerStyle={styles.settingItem}
        onPress={() => onCancel()}>
        <ListItem.Content style={styles.settingItemContent}>
          <ListItem.Title
            style={[styles.settingItemTitle, {color: LIGHT_GREY}]}>
            Cancel
          </ListItem.Title>
        </ListItem.Content>
      </ListItem>
    </>
  );
};

const styles = StyleSheet.create({
  settingItem: {
    height: 50,
    alignContent: 'center',
    backgroundColor: 'transparent',
    overlayColor: 'green',
  },
  settingItemContent: {
    height: 44,
    backgroundColor: 'white',
    justifyContent: 'center',
    borderRadius: DEFAULT_BORDER,
  },
  settingItemTitle: {
    width: '100%',
    textAlign: 'center',
  },
});

export default Settings;
