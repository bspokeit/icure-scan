import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import PatientListScreen from "./src/screens/PatientListScreen";

const navigator = createStackNavigator(
  {
    PatientList: PatientListScreen,
  },
  {
    initialRouteName: "PatientList",
    defaultNavigationOptions: {
      title: "iCure Scan Companion",
    },
  }
);

export default createAppContainer(navigator);
