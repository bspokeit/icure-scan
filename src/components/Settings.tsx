import React from 'react';
import { StyleSheet } from 'react-native';
import { ListItem } from 'react-native-elements';
import {
  DEFAULT_BORDER,
  LIGHT_GREY,
  MAIN_COLOR,
  SECONDARY_ACTION,
} from '../constant';
import useAuth from '../hooks/useAuth';

interface Props {
  onCancel: () => void;
}

const Settings: React.FC<Props> = ({ onCancel }) => {
  const { logUserOut, logoutUserOutHard } = useAuth();

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
        onPress={onLogout}
      >
        <ListItem.Content style={styles.settingItemContent}>
          <ListItem.Title
            style={[styles.settingItemTitle, { color: MAIN_COLOR }]}
          >
            Logout
          </ListItem.Title>
        </ListItem.Content>
      </ListItem>
      <ListItem
        key={2}
        underlayColor={LIGHT_GREY}
        containerStyle={styles.settingItem}
        onPress={onLogoutHard}
      >
        <ListItem.Content style={styles.settingItemContent}>
          <ListItem.Title
            style={[styles.settingItemTitle, { color: SECONDARY_ACTION }]}
          >
            Logout and clear key(s)
          </ListItem.Title>
        </ListItem.Content>
      </ListItem>
      <ListItem
        key={3}
        underlayColor={LIGHT_GREY}
        containerStyle={styles.settingItem}
        onPress={() => onCancel()}
      >
        <ListItem.Content style={styles.settingItemContent}>
          <ListItem.Title
            style={[styles.settingItemTitle, { color: LIGHT_GREY }]}
          >
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
