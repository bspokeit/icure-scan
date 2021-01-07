import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Avatar, ListItem } from 'react-native-elements';
import { addressAsString } from '../utils/addressHelper';
import { dateOfBirthInfo } from '../utils/dateHelper';
import { ab2Base64 } from '../utils/pictureHelper';

const PatientListItem = ({ patient }) => {
  return (
    <ListItem bottomDivider>
      {patient.picture ? (
        <Avatar
          rounded
          source={{
            uri: ab2Base64(patient.picture),
          }}
          size="medium"
        />
      ) : (
        <Avatar
          rounded
          size="medium"
          icon={{
            name: 'user-circle',
            type: 'font-awesome',
            size: 32,
            color: 'grey',
          }}
        />
      )}
      <ListItem.Content>
        <ListItem.Title>{`${patient.firstName} ${patient.lastName}`}</ListItem.Title>
        <ListItem.Subtitle>
          <Text style={styles.subTitle}>
            {dateOfBirthInfo(patient.dateOfBirth)}
          </Text>
        </ListItem.Subtitle>
        <ListItem.Subtitle>
          <Text style={styles.subTitle}>
            {addressAsString(patient.addresses)}
          </Text>
        </ListItem.Subtitle>
      </ListItem.Content>
      <ListItem.Chevron />
    </ListItem>
  );
};

const styles = StyleSheet.create({
  subTitle: {
    fontSize: 12,
  },
});

export default PatientListItem;
