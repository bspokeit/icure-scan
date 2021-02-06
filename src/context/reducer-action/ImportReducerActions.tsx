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

import { ActionMap } from '../../models';
import {
  ImportTask,
  ImportTaskDocument,
  ImportTaskStatus,
} from '../../models/core/import-task.model';

export enum ImportStatus {
  Pending = 'PENDING',
  Ongoing = 'ONGOING',
  Done = 'DONE',
  Error = 'ERROR',
}

export interface ImportState {
  active: boolean;
  documents: ImportTaskDocument[];
  status: ImportStatus;
  tasks: ImportTask[];
  final?: ImportTask;
}

export enum ImportActionTypes {
  Collect = 'COLLECT',
  Clear = 'CLEAR',
  Reset = 'RESET',
  Activate = 'SET_MODE',
  SetStatus = 'SET_STATUS',
  SetTasks = 'SET_TASKS',
  UpdateTask = 'UPDATE_TASK',
  SetFinal = 'SET_FINAL',
}

export type ImportActionPayloadTypes = {
  [ImportActionTypes.Collect]: ImportTaskDocument;
  [ImportActionTypes.Clear]: undefined;
  [ImportActionTypes.Reset]: undefined;
  [ImportActionTypes.Activate]: boolean;
  [ImportActionTypes.SetStatus]: ImportStatus;
  [ImportActionTypes.SetTasks]: Array<ImportTask>;
  [ImportActionTypes.UpdateTask]: { id: string; status: ImportTaskStatus };
  [ImportActionTypes.SetFinal]: ImportTask | undefined;
};

export type ImportAction = ActionMap<ImportActionPayloadTypes>[keyof ActionMap<ImportActionPayloadTypes>];
