import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { Provider as IcureProvider } from './src/context/IcureContext';
import { Provider as AuthProvider } from './src/context/AuthContext';
import LoginScreen from './src/screens/LoginScreen';
import InitApplicationScreen from './src/screens/InitApplicationScreen';
import PatientDetailScreen from './src/screens/PatientDetail';
import PatientListScreen from './src/screens/PatientListScreen';
import { setNavigator } from './src/utils/navigationHelper';

const switchNavigator = createSwitchNavigator({
  Init: InitApplicationScreen,
  Login: LoginScreen,
  mainFlow: createStackNavigator({
    List: PatientListScreen,
    Detail: PatientDetailScreen,
  }),
});

const App = createAppContainer(switchNavigator);

export default () => {
  return (
    <IcureProvider>
      <AuthProvider>
        <App
          ref={(navigator) => {
            setNavigator(navigator);
          }}
        />
      </AuthProvider>
    </IcureProvider>
  );
};
