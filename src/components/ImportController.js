import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';

const ImportController = ({ onCancel }) => {
  return (
    <View style={styles.container}>
      <Text>Hello from Overlay!</Text>
      <Button onPress={onCancel} title="Cancel"></Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '80%',
    width: '100%',
    borderColor: 'red',
    borderWidth: 2,
  },
  imageContainerStyle: {
    flex: 1,
    flexDirection: 'column',
    margin: 1,
  },
  imageStyle: {
    height: '80%',
    width: '100%',
  },
});

export default ImportController;
