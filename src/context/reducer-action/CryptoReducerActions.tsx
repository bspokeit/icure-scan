import { ActionMap } from '../../models';

export interface CryptoState {
  keys: { [hcpId: string]: string };
  keyImports: { [hcpId: string]: boolean };
}

export enum CryptoActionTypes {
  SetKeyImport = 'SET_KEY_IMPORT',
  SetKey = 'SET_KEY',
  DeleteKey = 'DELETE_PRIVATE_KEY',
}

export type CryptoActionPayloadTypes = {
  [CryptoActionTypes.SetKeyImport]: { [hcpId: string]: boolean };
  [CryptoActionTypes.SetKey]: { [hcpId: string]: string };
  [CryptoActionTypes.DeleteKey]: string;
};

export type CryptoAction = ActionMap<CryptoActionPayloadTypes>[keyof ActionMap<CryptoActionPayloadTypes>];
