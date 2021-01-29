import React from 'react';
import {
  createAppContainer,
  createSwitchNavigator,
  NavigationContainerComponent,
} from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { Provider as AuthProvider } from './src/context/AuthContext';
import { Provider as CryptoProvider } from './src/context/CryptoContext';
import { Provider as ImportProvider } from './src/context/ImportContext';
import { Provider as PatientProvider } from './src/context/PatientContext';
import { Provider as SystemProvider } from './src/context/SystemContext';
import DocumentGalleryScreen from './src/screens/DocumentGalleryScreen';
import ImportDocumentDrawScreen from './src/screens/ImportDocumentDrawScreen';
import ImportKeyScreen from './src/screens/ImportKeyScreen';
import InitApplicationScreen from './src/screens/InitApplicationScreen';
import LoginScreen from './src/screens/LoginScreen';
import PatientDetailScreen from './src/screens/PatientDetailScreen';
import PatientImportDocumentScreen from './src/screens/PatientImportDocumentScreen';
import PatientListScreen from './src/screens/PatientListScreen';
import { setNavigator } from './src/utils/navigationHelper';

const switchNavigator = createSwitchNavigator({
  Init: InitApplicationScreen,
  Login: LoginScreen,
  ImportKey: ImportKeyScreen,

  mainFlow: createStackNavigator({
    List: PatientListScreen,
    Detail: PatientDetailScreen,
    Gallery: DocumentGalleryScreen,
    Import: PatientImportDocumentScreen,
    Draw: ImportDocumentDrawScreen,
  }),
});

const App = createAppContainer(switchNavigator);

export default () => {
  return (
    <SystemProvider>
      <AuthProvider>
        <CryptoProvider>
          <PatientProvider>
            <ImportProvider>
              <App
                ref={(navigator: NavigationContainerComponent) => {
                  setNavigator(navigator);
                }}
              />
            </ImportProvider>
          </PatientProvider>
        </CryptoProvider>
      </AuthProvider>
    </SystemProvider>
  );
};
