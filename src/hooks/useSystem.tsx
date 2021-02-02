import _ from 'lodash';
import { useContext } from 'react';
import { SystemCheckStatus } from '../context/reducer-action/SystemReducerActions';
import { Context as SystemContext } from '../context/SystemContext';

export default () => {
  const {
    state: { systemChecks },
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
      setSystemChecked &&
      _.every(systemChecks, { status: SystemCheckStatus.Ready })
    );
  };

  return { checkSystem, systemIsReady };
};
