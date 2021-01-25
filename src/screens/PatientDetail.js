import * as ImagePicker from 'expo-image-picker';
import React, { useContext, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Icon, Overlay } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import ImageImporter from '../components/ImageImporter';
import { Context as AuthContext } from '../context/AuthContext';
import { Context as PatientContext } from '../context/PatientContext';
import ContactList from '../components/ContactList';

const PatientDetailScreen = ({ navigation }) => {
  const {
    state: { images, importMode, patientContacts },
    collectImage,
    setImportMode,
    getContacts,
  } = useContext(PatientContext);

  const {
    state: { currentUser },
  } = useContext(AuthContext);

  const patient = navigation.getParam('patient');

  useEffect(() => {
    getContacts(currentUser, patient);
  }, []);

  const cameraRequest = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need Camera permissions to make this work!');
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.5,
      allowsMultipleSelection: true,
      base64: true,
    });

    if (!result.cancelled) {
      collectImage(result);
    }
  };

  const galleryRequest = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need MediaLibrary permissions to make this work!');
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.5,
      allowsMultipleSelection: true,
      base64: true,
    });

    if (!result.cancelled) {
      collectImage(result);
    }
  };

  const activateImportMode = async () => {
    setImportMode(true);
  };

  const deactivateImportMode = async () => {
    setImportMode(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.upperContainer}>
        {patientContacts.length ? (
          <View>
            <ContactList contacts={patientContacts}></ContactList>
          </View>
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
        {images.length ? (
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
      <Overlay
        overlayStyle={styles.overlayStyle}
        isVisible={importMode}
        fullscreen
      >
        <ImageImporter
          onDone={deactivateImportMode}
          patient={patient}
        ></ImageImporter>
      </Overlay>
    </SafeAreaView>
  );
};

PatientDetailScreen.navigationOptions = ({ navigation }) => {
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
    marginBottom: 80,
  },
  titleStyle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  textStyle: {
    fontSize: 16,
    textAlign: 'center',
    padding: 10,
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

export default PatientDetailScreen;
