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

export const ImagePickerConverter = (output: any /*ImagePicker.ImagePickerResult*/) => {
  return new ImportTaskDocument({ ...output });
};

export interface ProcessTaskNewContent {
  services: Array<Service>;
  documents: Array<Document>;
  contact?: Contact;
}
