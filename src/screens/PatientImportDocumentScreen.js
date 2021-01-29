import * as ImagePicker from 'expo-image-picker';
import React, { useContext } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Icon, Overlay } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import DocumentImporter from '../components/DocumentImporter';
import ImportDocumentGallery from '../components/ImportDocumentGallery';
import { Context as ImportContext } from '../context/ImportContext';
import { ImagePickerConverter } from '../models/core/import-task.model';

const PatientImportDocumentScreen = ({ navigation }) => {
  const {
    state: { documents, active },
    collect,
    activate,
  } = useContext(ImportContext);

  const patient = navigation.getParam('patient');

  const activateImportMode = async () => {
    activate(true);
  };

  const deactivateImportMode = async () => {
    activate(false);
    navigation.goBack();
  };

  const cameraRequest = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need Camera permissions to make this work!');
    }

    let result = await ImagePicker.launchCameraAsync(IMPORT_OPTION);

    collect(ImagePickerConverter(result));
  };

  const galleryRequest = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need MediaLibrary permissions to make this work!');
    }

    let result = await ImagePicker.launchImageLibraryAsync(IMPORT_OPTION);

    collect(ImagePickerConverter(result));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.upperContainer}>
        {documents.length ? (
          <ImportDocumentGallery></ImportDocumentGallery>
        ) : null}
      </View>
      <View style={styles.actionButtonBlock}>
        <TouchableOpacity activeOpacity={0.7} onPress={galleryRequest}>
          <Icon
            reverse
            raised
            name="images"
            type="ionicon"
            color="#00aced"
            style={styles.actionButtonStyle}
          />
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.7} onPress={cameraRequest}>
          <Icon reverse raised name="camera" type="ionicon" color="#517fa4" />
        </TouchableOpacity>
        {documents.length ? (
          <TouchableOpacity activeOpacity={0.7} onPress={activateImportMode}>
            <Icon
              reverse
              raised
              name="cloud-upload"
              type="ionicon"
              color="green"
            />
          </TouchableOpacity>
        ) : null}
      </View>
      <Overlay overlayStyle={styles.overlayStyle} isVisible={active} fullscreen>
        <DocumentImporter
          onDone={deactivateImportMode}
          patient={patient}
        ></DocumentImporter>
      </Overlay>
    </SafeAreaView>
  );
};

PatientImportDocumentScreen.navigationOptions = ({ navigation }) => {
  const patient = navigation.getParam('patient');
  return {
    headerTitle: `${patient.firstName} ${patient.lastName}`,
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: -20, // TODO: fihure out this margin shift
  },
  upperContainer: {
    // marginBottom: 80,
  },
  actionButtonBlock: {
    position: 'absolute',
    height: 80,
    width: '100%',
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-around',
    flexDirection: 'row',
  },
  overlayStyle: {
    width: '90%',
    height: '90%',
  },
});

export default PatientImportDocumentScreen;
