import {
  NavigationActions,
  NavigationContainerComponent,
  NavigationParams,
} from 'react-navigation';

let navigator: NavigationContainerComponent;

export const setNavigator = (nav: NavigationContainerComponent): void => {
  navigator = nav;
};

export const navigate = (routeName: string, params: NavigationParams) => {
  if (navigator) {
    navigator.dispatch(
      NavigationActions.navigate({
        routeName,
        params,
      })
    );
  }
};
