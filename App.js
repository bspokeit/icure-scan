import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { Provider as AuthProvider } from './src/context/AuthContext';
import { Provider as CryptoProvider } from './src/context/CryptoContext';
import { Provider as ImportProvider } from './src/context/ImportContext';
import { Provider as PatientProvider } from './src/context/PatientContext';
import { Provider as SystemProvider } from './src/context/SystemContext';
import ImportKeyScreen from './src/screens/ImportKeyScreen';
import InitApplicationScreen from './src/screens/InitApplicationScreen';
import LoginScreen from './src/screens/LoginScreen';
import PatientDetailScreen from './src/screens/PatientDetail';
import PatientImportDocumentScreen from './src/screens/PatientImportDocumentScreen';
import PatientListScreen from './src/screens/PatientListScreen';
import { setNavigator } from './src/utils/navigationHelper';

FileReader.prototype.readAsArrayBuffer = function (blob) {
  if (this.readyState === this.LOADING) throw new Error('InvalidStateError');
  this._setReadyState(this.LOADING);
  this._result = null;
  this._error = null;
  const fr = new FileReader();
  fr.onloadend = () => {
    const content = atob(
      fr.result.substr('data:application/octet-stream;base64,'.length)
    );
    const buffer = new ArrayBuffer(content.length);
    const view = new Uint8Array(buffer);
    view.set(Array.from(content).map((c) => c.charCodeAt(0)));
    this._result = buffer;
    this._setReadyState(this.DONE);
  };
  fr.readAsDataURL(blob);
};

const switchNavigator = createSwitchNavigator({
  Init: InitApplicationScreen,
  Login: LoginScreen,
  ImportKey: ImportKeyScreen,

  mainFlow: createStackNavigator({
    List: PatientListScreen,
    Detail: PatientDetailScreen,
    Import: PatientImportDocumentScreen,
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
                ref={(navigator) => {
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
