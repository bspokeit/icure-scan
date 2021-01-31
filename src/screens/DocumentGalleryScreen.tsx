import moment from 'moment';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  NavigationStackScreenComponent,
  NavigationStackScreenProps,
} from 'react-navigation-stack';
import DocumentGallery from '../components/DocumentGallery';
import PatientHeader from '../components/PatientHeader';

interface Props extends NavigationStackScreenProps {}

const DocumentGalleryScreen: NavigationStackScreenComponent<Props> = ({
  navigation,
}) => {
  const patient = navigation.state.params?.patient;
  const contact = navigation.state.params?.contact;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <PatientHeader
          patient={patient}
          goBack={() => navigation.goBack()}
          subTitle={`Contact du ${moment(contact.created).format(
            'DD/MM/YYYY'
          )}`}
        ></PatientHeader>
      </View>
      <View>
        <DocumentGallery patient={patient} contact={contact}></DocumentGallery>
      </View>
    </SafeAreaView>
  );
};

DocumentGalleryScreen.navigationOptions = () => {
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
    borderRadius: 8,
  },
  actionButtonBlock: {
    position: 'absolute',
    height: 80,
    width: '100%',
    left: 0,
    right: 0,
    bottom: 0,
    paddingRight: 20,
    justifyContent: 'flex-end',
    flexDirection: 'row',
    backgroundColor: 'transparent',
  },
});

export default DocumentGalleryScreen;
