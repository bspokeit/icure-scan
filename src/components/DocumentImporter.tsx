import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Divider } from 'react-native-elements';
import { Context as ImportContext } from '../context/ImportContext';
import { ImportStatus } from '../context/reducer-action/ImportReducerActions';
import useImporter from '../hooks/useImporter';
import { Patient } from '../models';
import { ImportTaskStatus } from '../models/core/import-task.model';

interface Props {
  patient: Patient;
  onDone: () => void;
}

const DocumentImporter: React.FC<Props> = ({ onDone, patient }) => {
  const {
    state: { documents, status, tasks, final },
    clear,
    activate,
    reset,
  } = useContext(ImportContext);

  const { startImport } = useImporter();

  const start = async () => {
    await startImport(patient);
  };

  const done = () => {
    reset();
    clear();
    onDone();
  };

  const cancel = () => {
    reset();
    activate(false);
  };

  if (status === ImportStatus.Done || status === ImportStatus.Error) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Import to Cloud</Text>
        <Divider style={{ backgroundColor: 'blue' }} />
        <View style={styles.body}>
          <Text style={styles.bodyLine}>
            {status === ImportStatus.Error
              ? 'Something went wrong! Please, try again.'
              : 'Import is done!'}
          </Text>
        </View>
        <Divider style={{ backgroundColor: 'blue' }} />
        <View style={styles.controller}>
          <Button
            buttonStyle={styles.control}
            onPress={done}
            title="Ok"
          ></Button>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Import to Cloud</Text>
      <Divider style={{ backgroundColor: 'blue' }} />
      <View style={styles.body}>
        {!tasks?.length ? (
          <Text style={styles.bodyLine}>
            Ready to import {documents.length}{' '}
            {documents.length === 1 ? 'document' : 'documents'}
          </Text>
        ) : null}

        {tasks?.length ? (
          <Text style={styles.bodyLine}>
            Import ongoing{' '}
            {`${
              tasks.filter((t) => t.status === ImportTaskStatus.Done).length
            }/${tasks.length}`}
          </Text>
        ) : null}

        {final && final.status === ImportTaskStatus.Pending ? (
          <Text style={styles.bodyLine}>Finalisation ongoing</Text>
        ) : null}
      </View>
      <Divider style={{ backgroundColor: 'blue' }} />
      <View style={styles.controller}>
        <Button
          buttonStyle={styles.control}
          type="outline"
          onPress={cancel}
          title="Cancel"
          disabled={status === ImportStatus.Ongoing}
        ></Button>
        <Button
          buttonStyle={styles.control}
          onPress={start}
          title="Start"
          disabled={status === ImportStatus.Ongoing}
          loading={status === ImportStatus.Ongoing}
        ></Button>
      </View>
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
    flex: 3,
    justifyContent: 'center',
  },
  bodyLine: {
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 16,
  },
  controller: {
    flex: 2,
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
