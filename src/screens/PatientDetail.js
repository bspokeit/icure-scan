import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';

const PatientDetailScreen = ({ navigation }) => {
  const patient = navigation.getParam('patient');

  const cameraRequest = () => {
    alert('Camera Button Clicked');
  };

  const galleryRequest = () => {
    alert('Gallery Button Clicked');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.titleStyle}>
          Example of React Native Floating Action Button
        </Text>
        <Text style={styles.textStyle}>
          Click on Action Button to see Alert
        </Text>
        <Text style={styles.titleStyle}>
          Example of React Native Floating Action Button
        </Text>
        <Text style={styles.textStyle}>
          Click on Action Button to see Alert
        </Text>
        <Text style={styles.titleStyle}>
          Example of React Native Floating Action Button
        </Text>
        <Text style={styles.textStyle}>
          Click on Action Button to see Alert
        </Text>
        <Text style={styles.titleStyle}>
          Example of React Native Floating Action Button
        </Text>
        <Text style={styles.textStyle}>
          Click on Action Button to see Alert
        </Text>
        <Text style={styles.titleStyle}>
          Example of React Native Floating Action Button
        </Text>
        <Text style={styles.textStyle}>
          Click on Action Button to see Alert
        </Text>
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
            <Icon
              reverse
              raised
              name="camera"
              type="ionicon"
              color="#517fa4"
              style={styles.actionButtonStyle}
            />
          </TouchableOpacity>
        </View>
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
    height: 70,
    left: 30,
    right: 30,
    bottom: 30,
    justifyContent: 'space-around',
    flexDirection: 'row',
    borderColor: 'red',
    borderWidth: 2,
    borderStyle: 'solid',
  },
  actionButtonStyle: {
    width: 60,
    height: 60,
    color: 'green',
  },
});

export default PatientDetailScreen;
