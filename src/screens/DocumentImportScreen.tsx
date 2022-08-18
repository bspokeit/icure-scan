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

import { Icon, Overlay } from '@rneui/base';
import React, { useContext } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationStackScreenComponent, NavigationStackScreenProps } from 'react-navigation-stack';
import DocumentImporter from '../components/DocumentImporter';
import ImportDocumentGallery from '../components/ImportDocumentGallery';
import PatientHeader from '../components/PatientHeader';
import { DEFAULT_BORDER, IMPORT_OPTION, LAST_ACTION, MAIN_ACTION, SECONDARY_ACTION } from '../constant';
import { Context as ImportContext } from '../context/ImportContext';
import { Patient } from '../models';
import { ImagePickerConverter } from '../models/core/import-task.model';

interface Props extends NavigationStackScreenProps {}

const DocumentImportScreen: NavigationStackScreenComponent<Props> = ({ navigation }) => {
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
    let result = await launchCamera(IMPORT_OPTION);
    //  TODO: add user feedback to permission or availability issue
    //  TODO: test on physical device
    if (result?.errorCode) {
      console.error(result?.errorCode);
      return;
    }
    console.log('cameraRequest result: ', result);
    collect(ImagePickerConverter(result));
  };

  const galleryRequest = async () => {
    let result = await launchImageLibrary(IMPORT_OPTION);
    //  TODO: add user feedback to permission or availability issue
    if (result?.errorCode) {
      console.error(result?.errorCode);
      return;
    }

    collect(ImagePickerConverter(result));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <PatientHeader
          patient={patient}
          goBack={() => navigation.goBack()}
          subTitle={`New document import`}></PatientHeader>
      </View>
      <View>
        <ImportDocumentGallery></ImportDocumentGallery>
      </View>
      <View style={styles.actionButtonBlock}>
        {
          <TouchableOpacity activeOpacity={0.7} onPress={galleryRequest}>
            <Icon reverse raised name="images" type="ionicon" color={LAST_ACTION} />
          </TouchableOpacity>
        }
        {
          <TouchableOpacity activeOpacity={0.7} onPress={cameraRequest}>
            <Icon reverse raised name="camera" type="ionicon" color={SECONDARY_ACTION} />
          </TouchableOpacity>
        }
        {documents.length ? (
          <TouchableOpacity activeOpacity={0.7} onPress={activateImportMode}>
            <Icon reverse raised name="cloud-upload" color={MAIN_ACTION} />
          </TouchableOpacity>
        ) : null}
      </View>
      <Overlay overlayStyle={styles.overlayStyle} isVisible={active} fullScreen>
        <DocumentImporter onDone={deactivateImportMode} patient={patient}></DocumentImporter>
      </Overlay>
    </SafeAreaView>
  );
};

DocumentImportScreen.navigationOptions = () => {
  return {
    headerShown: false,
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 50,
    margin: 8,
    marginTop: 8,
    backgroundColor: 'white',
    borderRadius: DEFAULT_BORDER,
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
    borderRadius: DEFAULT_BORDER,
  },
});

export default DocumentImportScreen;
