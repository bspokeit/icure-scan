import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';

const ImportController = ({ onCancel }) => {
  const startImport = async () => {};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Import to Cloud</Text>
      <View style={styles.body}></View>
      <View style={styles.controller}>
        <Button
          buttonStyle={styles.control}
          type="outline"
          onPress={onCancel}
          title="Cancel"
        ></Button>
        <Button
          buttonStyle={styles.control}
          onPress={startImport}
          title="Start"
        ></Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    borderColor: 'red',
    borderWidth: 2,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    borderColor: 'purple',
    borderWidth: 2,
    width: '100%',
    justifyContent: 'center',
    fontSize: 16,
    padding: 5,
  },
  body: {
    flex: 8,
  },
  controller: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'green',
    borderWidth: 2,
  },
  control: {
    width: 120,
    borderColor: 'red',
    borderWidth: 2,
    marginLeft: 6,
    marginRight: 6,
  },
});

export default ImportController;
