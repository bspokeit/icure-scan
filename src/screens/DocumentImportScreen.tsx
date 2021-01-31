import * as ImagePicker from 'expo-image-picker';
import React, { useContext } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Icon, Overlay } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  NavigationStackScreenComponent,
  NavigationStackScreenProps,
} from 'react-navigation-stack';
import DocumentImporter from '../components/DocumentImporter';
import ImportDocumentGallery from '../components/ImportDocumentGallery';
import { BLUE, MAIN_ACTION, MAIN_COLOR, IMPORT_OPTION } from '../constant';
import { Context as ImportContext } from '../context/ImportContext';
import { Patient } from '../models';
import { ImagePickerConverter } from '../models/core/import-task.model';

interface Props extends NavigationStackScreenProps {}

const DocumentImportScreen: NavigationStackScreenComponent<Props> = ({
  navigation,
}) => {
  const {
    state: { documents, active },
    collect,
    activate,
  } = useContext(ImportContext);

  const patient: Patient = navigation.state.params?.patient;

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
        <ImportDocumentGallery></ImportDocumentGallery>
      </View>
      <View style={styles.actionButtonBlock}>
        <TouchableOpacity activeOpacity={0.7} onPress={galleryRequest}>
          <Icon reverse raised name="images" type="ionicon" color={BLUE} />
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.7} onPress={cameraRequest}>
          <Icon reverse raised name="camera" type="ionicon" color={MAIN_COLOR} />
        </TouchableOpacity>
        {documents.length ? (
          <TouchableOpacity activeOpacity={0.7} onPress={activateImportMode}>
            <Icon
              reverse
              raised
              name="cloud-upload"
              type="ionicon"
              color={MAIN_ACTION}
            />
          </TouchableOpacity>
        ) : null}
      </View>
      <Overlay overlayStyle={styles.overlayStyle} isVisible={active} fullScreen>
        <DocumentImporter
          onDone={deactivateImportMode}
          patient={patient}
        ></DocumentImporter>
      </Overlay>
    </SafeAreaView>
  );
};

DocumentImportScreen.navigationOptions = ({ navigation }) => {
  const patient: Patient = navigation.state.params?.patient;
  return {
    headerTitle: `${patient?.firstName} ${patient?.lastName}`,
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: -20, // TODO: fihure out this margin shift
  },
  upperContainer: {
    height: '100%',
    marginBottom: 80,
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
    height: '60%',
  },
});

export default DocumentImportScreen;
