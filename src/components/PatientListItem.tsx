import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Avatar, ListItem } from 'react-native-elements';
import { Patient } from '../models';
import { addressAsString } from '../utils/addressHelper';
import { dateOfBirthInfo } from '../utils/dateHelper';
import { arrayBuffer2Base64 } from '../utils/formatHelper';

interface Props {
  patient: Patient;
  onSelection: () => void;
}

const PatientListItem: React.FC<Props> = ({ patient, onSelection }) => {
  return (
    <ListItem onPress={onSelection} bottomDivider>
      {patient.picture ? (
        <Avatar
          rounded
          source={{
            uri: arrayBuffer2Base64(patient.picture),
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
