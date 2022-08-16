/*
 * Copyright (C) 2022 Bspoke IT SRL
 *
 * This file is part of icure-scan.
 *
 * icure-scan is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * icure-scan is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with icure-scan.  If not, see <http://www.gnu.org/licenses/>.
 */

import { Button, Divider } from '@rneui/base';
import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LIGHT_GREY, MAIN_ACTION, MAIN_COLOR } from '../constant';
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
            {status === ImportStatus.Error ? 'Something went wrong! Please, try again.' : 'Import is done!'}
          </Text>
        </View>
        <Divider style={{ backgroundColor: 'blue' }} />
        <View style={styles.controller}>
          <Button buttonStyle={[styles.control, styles.controlDone]} onPress={done} title="Ok" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Import to Cloud</Text>
      <Divider style={{ backgroundColor: LIGHT_GREY, margin: 0 }} />
      <View style={styles.body}>
        {!tasks?.length ? (
          <Text style={styles.bodyLine}>
            Ready to import {documents.length} {documents.length === 1 ? 'document' : 'documents'}
          </Text>
        ) : null}

        {tasks?.length ? (
          <Text style={styles.bodyLine}>
            Import ongoing {`${tasks.filter(t => t.status === ImportTaskStatus.Done).length}/${tasks.length}`}
          </Text>
        ) : null}

        {final && final.status === ImportTaskStatus.Pending ? (
          <Text style={styles.bodyLine}>Finalisation ongoing</Text>
        ) : null}
      </View>
      <Divider style={{ backgroundColor: LIGHT_GREY, margin: 0 }} />
      <View style={styles.controller}>
        <Button
          buttonStyle={[styles.control, styles.controlCancel]}
          onPress={cancel}
          title="Cancel"
          titleStyle={styles.controlCancel}
          disabled={status === ImportStatus.Ongoing}
        />
        <Button
          buttonStyle={[styles.control, styles.controlStart]}
          onPress={start}
          title="Start"
          disabled={status === ImportStatus.Ongoing}
          loading={status === ImportStatus.Ongoing}
        />
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
    color: MAIN_COLOR,
  },
  body: {
    flex: 3,
    justifyContent: 'center',
  },
  bodyLine: {
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 16,
    color: MAIN_COLOR,
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
  controlCancel: {
    backgroundColor: 'transparent',
    color: LIGHT_GREY,
  },
  controlStart: {
    backgroundColor: MAIN_ACTION,
  },
  controlDone: { backgroundColor: MAIN_ACTION },
});

export default DocumentImporter;
