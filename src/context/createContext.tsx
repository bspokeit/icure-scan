import React, { useReducer } from 'react';

export default (reducer: any, actions: any, defaultValue: any) => {
  const Context: React.Context<any> = React.createContext(defaultValue);

  const Provider = ({ children }: any): JSX.Element => {
    const [state, dispatch] = useReducer(reducer, defaultValue);

    const boundActions: any = {};
    for (let key in actions) {
      boundActions[key] = actions[key](dispatch);
    }

    return (
      <Context.Provider value={{ state, ...boundActions }}>
        {children}
      </Context.Provider>
    );
  };

  return { Context, Provider };
};
