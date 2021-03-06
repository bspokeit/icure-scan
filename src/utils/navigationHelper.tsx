/*
 * Copyright (C) 2021 Bspoke IT SRL
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

import {
  NavigationActions,
  NavigationContainerComponent,
  NavigationParams,
} from 'react-navigation';

let navigator: NavigationContainerComponent;

export const setNavigator = (nav: NavigationContainerComponent): void => {
  navigator = nav;
};

export const navigate = (routeName: string, params?: NavigationParams) => {
  if (navigator) {
    navigator.dispatch(
      NavigationActions.navigate({
        routeName,
        params,
      })
    );
  }
};
