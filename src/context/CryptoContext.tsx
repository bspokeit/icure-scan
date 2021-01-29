import React, { createContext, useReducer } from 'react';
import {
  CryptoAction,
  CryptoActionTypes,
  CryptoState,
} from './reducer-action/CryptoReducerActions';

const cryptoReducer = (state: CryptoState, action: CryptoAction) => {
  switch (action.type) {
    case CryptoActionTypes.SetKeyImport:
      const keyImports = { ...state.keyImports, ...action.payload };
      return { ...state, keyImports };
    case CryptoActionTypes.SetKey:
      const extendedKeySet = { ...state.keys, ...action.payload };
      return { ...state, keys: extendedKeySet };
    case CryptoActionTypes.DeleteKey:
      const cleanedKeySet = { ...state.keys };
      delete cleanedKeySet[action.payload];
      return { ...state, keys: cleanedKeySet };
    default:
      return state;
  }
};

const setKeyImport = (dispatch: React.Dispatch<CryptoAction>) => async (
  hcpId: string,
  status: boolean
): Promise<void> => {
  dispatch({
    type: CryptoActionTypes.SetKeyImport,
    payload: { [hcpId]: status },
  });
};

const setKey = (dispatch: React.Dispatch<CryptoAction>) => async (
  hcpId: string,
  key: string
): Promise<void> => {
  dispatch({
    type: CryptoActionTypes.SetKey,
    payload: { [hcpId]: key },
  });
};

const deleteKey = (dispatch: React.Dispatch<CryptoAction>) => async (
  hcpId: string
): Promise<void> => {
  dispatch({
    type: CryptoActionTypes.DeleteKey,
    payload: hcpId,
  });
};

const defaultCryptoState: CryptoState = {
  keys: {},
  keyImports: {},
};

const defaultCryptoDispatcher = {
  setKeyImport: (_a: string, _b: boolean) => Promise.resolve(),
  setKey: (_a: string, _b: string) => Promise.resolve(),
  deleteKey: (_a: string) => Promise.resolve(),
};

export const Context = createContext<{
  state: CryptoState;
  setKeyImport: (hcpId: string, status: boolean) => Promise<void>;
  setKey: (hcpId: string, key: string) => Promise<void>;
  deleteKey: (_hcpId: string) => Promise<void>;
}>({
  state: defaultCryptoState,
  ...defaultCryptoDispatcher,
});

export const Provider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(cryptoReducer, defaultCryptoState);

  const dispatcher = {
    setKeyImport: setKeyImport(dispatch),
    setKey: setKey(dispatch),
    deleteKey: deleteKey(dispatch),
  };
  return (
    <Context.Provider value={{ state, ...dispatcher }}>
      {children}
    </Context.Provider>
  );
};

export default { Context, Provider };
