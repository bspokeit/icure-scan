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
  Error = 'ERROR'
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
