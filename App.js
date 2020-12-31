import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { Provider as AuthProvider } from './src/context/AuthContext';
import { Provider as SystemProvider } from './src/context/SystemContext';
import { Provider as CryptoProvider } from './src/context/CryptoContext';
import { Provider as PatientProvider } from './src/context/PatientContext';
import ImportKeyScreen from './src/screens/ImportKeyScreen';
import InitApplicationScreen from './src/screens/InitApplicationScreen';
import LoginScreen from './src/screens/LoginScreen';
import PatientDetailScreen from './src/screens/PatientDetail';
import PatientListScreen from './src/screens/PatientListScreen';
import { setNavigator } from './src/utils/navigationHelper';

const switchNavigator = createSwitchNavigator({
  Init: InitApplicationScreen,
  Login: LoginScreen,
  ImportKey: ImportKeyScreen,

  mainFlow: createStackNavigator({
    List: PatientListScreen,
    Detail: PatientDetailScreen,
  }),
});

const App = createAppContainer(switchNavigator);

export default () => {
  return (
    <SystemProvider>
      <AuthProvider>
        <CryptoProvider>
          <PatientProvider>
            <App
              ref={(navigator) => {
                setNavigator(navigator);
              }}
            />
          </PatientProvider>
        </CryptoProvider>
      </AuthProvider>
    </SystemProvider>
  );
};
