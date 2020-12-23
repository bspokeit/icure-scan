import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { Provider as IcureProvider } from './src/context/IcureContext';
import InitApplicationScreen from './src/screens/InitApplicationScreen';
import PatientListScreen from './src/screens/PatientListScreen';
import { setNavigator } from './src/utils/navigationHelper';

const switchNavigator = createSwitchNavigator({
  Init: InitApplicationScreen,
  PatientList: PatientListScreen,
});

const App = createAppContainer(switchNavigator);

export default () => {
  return (
    <IcureProvider>
      <App
        ref={(navigator) => {
          setNavigator(navigator);
        }}
      />
    </IcureProvider>
  );
};
