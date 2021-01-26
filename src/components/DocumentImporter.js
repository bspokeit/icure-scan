import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Divider } from 'react-native-elements';
import { Context as ImportContext } from '../context/ImportContext';
import useDocumentImporter from '../hooks/useDocumentImporter';

const DocumentImporter = ({ onDone, patient }) => {
  const {
    state: { patientDocuments, importStatus, importTasks, closingTask },
    clearImages,
  } = useContext(ImportContext);

  const { startImport, cleanImportSetup } = useDocumentImporter();

  const start = async () => {
    await startImport(patient);
  };

  const done = () => {
    cleanImportSetup();
    if (importStatus === 'DONE') {
      clearImages();
    }
    onDone();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Import to Cloud</Text>
      <Divider style={{ backgroundColor: 'blue' }} />
      <View style={styles.body}>
        {!importTasks?.length ? (
          <Text style={styles.bodyLine}>
            Ready to import {patientDocuments.length}{' '}
            {patientDocuments.length === 1 ? 'document' : 'documents'}
          </Text>
        ) : null}

        {importTasks?.length ? (
          <Text style={styles.bodyLine}>
            Import ongoing{' '}
            {`${importTasks.filter((t) => t.importStatus === 'DONE').length}/${
              importTasks.length
            }`}
          </Text>
        ) : null}

        {closingTask ? (
          closingTask.importStatus === 'PENDING' ? (
            <Text style={styles.bodyLine}>Finalisation ongoing</Text>
          ) : (
            <Text style={styles.bodyLine}>Done!</Text>
          )
        ) : null}
      </View>
      <Divider style={{ backgroundColor: 'blue' }} />
      {importStatus === 'DONE' ? (
        <View style={styles.controller}>
          <Button
            buttonStyle={styles.control}
            onPress={done}
            title="Ok"
          ></Button>
        </View>
      ) : (
        <View style={styles.controller}>
          <Button
            buttonStyle={styles.control}
            type="outline"
            onPress={done}
            title="Cancel"
            disabled={importStatus === 'ONGOING'}
          ></Button>
          <Button
            buttonStyle={styles.control}
            onPress={start}
            title="Start"
            disabled={importStatus === 'ONGOING'}
            loading={importStatus === 'ONGOING'}
          ></Button>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    width: '100%',
    justifyContent: 'center',
    fontSize: 16,
    padding: 5,
  },
  body: {
    flex: 8,
    justifyContent: 'center',
  },
  bodyLine: {
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 16,
  },
  bodyLineIcon: {
    marginRight: 8,
  },
  controller: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  control: {
    width: 120,
    marginLeft: 6,
    marginRight: 6,
  },
});

export default DocumentImporter;
