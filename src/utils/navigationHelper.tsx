import {
  NavigationActions,
  NavigationContainerComponent,
} from 'react-navigation';

let navigator: NavigationContainerComponent | null;

export const setNavigator = (nav: NavigationContainerComponent | null) => {
  navigator = nav;
};

export const navigate = (routeName: string, params: any) => {
  if (navigator) {
    navigator.dispatch(
      NavigationActions.navigate({
        routeName,
        params,
      })
    );
  }
};
