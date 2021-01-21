import * as ImagePicker from 'expo-image-picker';
import React, { useContext } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import ImageSelection from '../components/ImageSelection';
import PatientScans from '../components/PatientScans';
import { Context as PatientContext } from '../context/PatientContext';
import useImageImporter from '../hooks/useImageImporter';

const PatientDetailScreen = ({ navigation }) => {
  const {
    state: { images },
    collectImage,
  } = useContext(PatientContext);

  const { startImport } = useImageImporter();

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

  const processImages = async () => {
    const patient = navigation.getParam('patient');
    startImport(patient);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.upperContainer}>
        {images.length ? (
          <ImageSelection images={images}></ImageSelection>
        ) : null}
        {!images.length ? <PatientScans images={images}></PatientScans> : null}
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
          <TouchableOpacity activeOpacity={0.7} onPress={processImages}>
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
});

export default PatientDetailScreen;
