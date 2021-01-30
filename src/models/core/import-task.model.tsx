import * as ImagePicker from 'expo-image-picker';
import { Contact } from './contact.model';
import { Document } from './document.model';
import { Service } from './service.model';

export const taskID = (): string => {
  return Math.random().toString(36).substr(2, 9) + '';
};

export enum ImportTaskType {
  Import = 'IMPORT',
  Final = 'FINAL',
}

export enum ImportTaskStatus {
  Pending = 'PENDING',
  Ongoing = 'ONGOING',
  Done = 'DONE',
}

export class ImportTask {
  id: string;
  type: ImportTaskType;
  status: ImportTaskStatus;
  document: ImportTaskDocument | undefined;

  constructor(json: Partial<ImportTask>) {
    this.id = taskID();
    this.type = json.type || ImportTaskType.Import;
    this.status = json.status || ImportTaskStatus.Pending;
    this.document = json.document;
  }
}

export class ImportTaskDocument {
  cancelled?: boolean;
  uri?: string;
  type?: 'image' | 'video';
  base64?: string;

  constructor(json: Partial<ImportTaskDocument>) {
    this.cancelled = json.cancelled;
    this.uri = json.uri;
    this.type = json.type;
    this.base64 = json.base64;
  }
}

export const ImagePickerConverter = (output: ImagePicker.ImagePickerResult) => {
  return new ImportTaskDocument({ ...output });
};

export interface ProcessTaskNewContent {
  services: Array<Service>;
  documents: Array<Document>;
  contact?: Contact;
}
