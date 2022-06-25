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

import _ from 'lodash';
import { useContext } from 'react';
import { SystemCheckStatus } from '../context/reducer-action/SystemReducerActions';
import { Context as SystemContext } from '../context/SystemContext';

export default () => {
  const {
    state: { systemChecks, checkCompleted },
    updateSystemCheck,
    setSystemChecked,
  } = useContext(SystemContext);

  const checkSystem = async () => {
    await _.reduce(
      systemChecks,
      async (acc, current) => {
        updateSystemCheck({
          ...current,
          status: await current.check(),
        });
        return acc;
      },
      Promise.resolve()
    );

    setSystemChecked(true);
  };

  const systemIsReady = () => {
    return (
      checkCompleted &&
      _.every(systemChecks, { status: SystemCheckStatus.Ready })
    );
  };

  return { checkSystem, systemIsReady };
};
