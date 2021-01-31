import React, { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { Avatar, ListItem } from 'react-native-elements';
import { DEFAULT_IMAGE_BACKGROUND, LIGHT_GREY, MAIN_COLOR } from '../constant';
import { Patient } from '../models';
import { addressAsString } from '../utils/addressHelper';
import { dateOfBirthInfo } from '../utils/dateHelper';
import { arrayBuffer2Base64 } from '../utils/formatHelper';

interface Props {
  patient: Patient;
  onSelection: () => void;
}

const PatientListItem: React.FC<Props> = ({ patient, onSelection }) => {
  const [dob, setDob] = useState('');
  const [add, setAdd] = useState('');

  useEffect(() => {
    setDob(dateOfBirthInfo(patient.dateOfBirth));
    setAdd(addressAsString(patient.addresses));
  }, []);

  return (
    <ListItem
      onPress={onSelection}
      containerStyle={styles.container}
      underlayColor={LIGHT_GREY}
    >
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
            size: 46,
            color: DEFAULT_IMAGE_BACKGROUND,
          }}
        />
      )}
      <ListItem.Content>
        <ListItem.Title
          style={styles.title}
        >{`${patient.firstName} ${patient.lastName}`}</ListItem.Title>
        {dob ? (
          <ListItem.Subtitle>
            <Text style={styles.subTitle}>{dob}</Text>
          </ListItem.Subtitle>
        ) : null}
        {add ? (
          <ListItem.Subtitle>
            <Text style={styles.subTitle}>
              {addressAsString(patient.addresses)}
            </Text>
          </ListItem.Subtitle>
        ) : null}
      </ListItem.Content>
      <ListItem.Chevron color={MAIN_COLOR} />
    </ListItem>
  );
};

const styles = StyleSheet.create({
  container: {
    marginLeft: 8,
    marginRight: 8,
    marginTop: 3,
    marginBottom: 3,
    borderRadius: 8,
  },
  title: {
    color: MAIN_COLOR,
  },
  subTitle: {
    fontSize: 12,
    color: LIGHT_GREY,
  },
});

export default PatientListItem;
