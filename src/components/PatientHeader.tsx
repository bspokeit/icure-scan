import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Avatar, Icon } from 'react-native-elements';
import { DEFAULT_IMAGE_BACKGROUND, GREY } from '../constant';
import { Patient } from '../models';
import { arrayBuffer2Base64 } from '../utils/formatHelper';

interface Props {
  patient: Patient;
  subTitle?: string;
  goBack: () => void;
}

const PatientHeader: React.FC<Props> = ({ patient, subTitle, goBack }) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.contentGoBack}>
          <TouchableOpacity onPress={goBack}>
            <Icon name="arrow-back" type="ionicons" color={GREY} size={20} />
          </TouchableOpacity>
        </View>
        <View style={styles.contentText}>
          <Text style={styles.contextTextTitle}>
            {patient?.firstName} {patient?.lastName}
          </Text>
          {subTitle ? (
            <Text style={styles.contentTextSubTitle}>{subTitle}</Text>
          ) : null}
        </View>
        <View style={styles.contentAvatar}>
          {patient.picture ? (
            <Avatar
              rounded
              source={{
                uri: arrayBuffer2Base64(patient.picture),
              }}
              size="small"
            />
          ) : (
            <Avatar
              rounded
              size="small"
              icon={{
                name: 'user-circle',
                type: 'font-awesome',
                size: 32,
                color: DEFAULT_IMAGE_BACKGROUND,
              }}
            />
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 50,
    width: '100%',
    alignContent: 'center',
    flexDirection: 'row',
  },
  content: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  contentGoBack: {
    flex: 1,
    justifyContent: 'center',
  },
  contentText: { flex: 6, justifyContent: 'center' },
  contentAvatar: {
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
  },
  contextTextTitle: {
    fontSize: 16,
    color: GREY,
  },
  contentTextSubTitle: { color: 'grey', fontSize: 12 },
  subTitle: {
    fontSize: 12,
  },
});

export default PatientHeader;
