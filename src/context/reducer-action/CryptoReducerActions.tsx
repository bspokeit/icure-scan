/*
 * Copyright (C) 2022 Bspoke IT SRL
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

import { ActionMap } from '../../models';

export interface CryptoState {
  keys: {[hcpId: string]: string};
  keyImports: {[hcpId: string]: boolean};
}

export enum CryptoActionTypes {
  SetKeyImport = 'SET_KEY_IMPORT',
  SetKey = 'SET_KEY',
  DeleteKey = 'DELETE_PRIVATE_KEY',
}

export type CryptoActionPayloadTypes = {
  [CryptoActionTypes.SetKeyImport]: {[hcpId: string]: boolean};
  [CryptoActionTypes.SetKey]: {[hcpId: string]: string};
  [CryptoActionTypes.DeleteKey]: string;
};

export type CryptoAction =
  ActionMap<CryptoActionPayloadTypes>[keyof ActionMap<CryptoActionPayloadTypes>];