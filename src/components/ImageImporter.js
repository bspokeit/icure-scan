import React, { useContext } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import { Context as PatientContext } from '../context/PatientContext';
import useImageImporter from '../hooks/useImageImporter';

const ImageImporter = ({ onCancel }) => {
  const {
    state: { images, importTasks, closingTask },
  } = useContext(PatientContext);

  const { startImport } = useImageImporter();

  const start = async () => {
    await startImport();
  };

  console.log('closingTask: ', closingTask);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Import to Cloud</Text>
      <View style={styles.body}>
        {!importTasks?.length ? (
          <Text style={styles.title}>
            Ready to import {images.length}{' '}
            {images.length === 1 ? 'document' : 'documents'}
          </Text>
        ) : null}

        {importTasks?.length ? (
          <Text style={styles.title}>
            Import ongoing{' '}
            {`${importTasks.filter((t) => t.importStatus === 'DONE').length}/${
              importTasks.length
            }`}
          </Text>
        ) : null}

        {closingTask ? (
          closingTask.importStatus === 'PENDING' ? (
            <Text style={styles.title}>Finalisation ongoing</Text>
          ) : (
            <Text style={styles.title}>Done!</Text>
          )
        ) : null}
      </View>
      <View style={styles.controller}>
        <Button
          buttonStyle={styles.control}
          type="outline"
          onPress={onCancel}
          title="Cancel"
        ></Button>
        <Button
          buttonStyle={styles.control}
          onPress={start}
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

export default ImageImporter;
