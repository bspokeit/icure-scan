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

import { groupBy, orderBy, uniqBy } from 'lodash';
import { ActionMap, Contact, Patient } from '../../models';

export type PatientContactState = {
  [patienId: string]: Array<Contact>;
};

//  Tensor like structure
export type PatientDocumentState = {
  [patientId: string]: {
    [documentId: string]: {
      [attachentId: string]: string;
    };
  };
};

export interface PatientState {
  searching: boolean;
  logs: Array<Patient>;
  list: Array<Patient>;
  contacts: PatientContactState;
  documents: PatientDocumentState;
}

export enum PatientActionTypes {
  SetSearching = 'SET_SEARCHING',
  SetSearch = 'SET_SEARCH',
  ResetSearch = 'CLEAR_SEARCH',
  SetLogs = 'SET_PATIENT_LOGS',
  CollectContacts = 'COLLECT_CONTACTS',
  CollectDocuments = 'COLLECT_DOCUMENTS',
}

export interface CollectContactActionPayload {
  patientId: string;
  contacts: Array<Contact>;
}

export interface CollectDocumentActionPayload {
  patientId: string;
  documents: Array<PatientDocumentActionPayload>;
}

export interface PatientDocumentActionPayload {
  documentId: string;
  attachmentId: string;
  url?: string;
}

export type PatientActionPayloadTypes = {
  [PatientActionTypes.SetSearching]: boolean;
  [PatientActionTypes.SetSearch]: Array<Patient>;
  [PatientActionTypes.ResetSearch]: undefined;
  [PatientActionTypes.SetLogs]: Array<Patient>;
  [PatientActionTypes.CollectContacts]: CollectContactActionPayload;
  [PatientActionTypes.CollectDocuments]: CollectDocumentActionPayload;
};

export type PatientAction =
  ActionMap<PatientActionPayloadTypes>[keyof ActionMap<PatientActionPayloadTypes>];

export const collectContactsAction = (
  state: PatientState,
  payload: CollectContactActionPayload,
) => {
  const {patientId, contacts} = payload;

  const updatedStateContacts = {...state.contacts};

  //  Init the patient contacts list if needed
  if (!updatedStateContacts[patientId]) {
    updatedStateContacts[patientId] = [];
  }

  //  Collect the patient contacts
  updatedStateContacts[patientId] = orderBy(
    uniqBy([...updatedStateContacts[patientId], ...contacts], 'id'),
    ['created'],
    ['desc'],
  );

  // And return the updated state
  return {
    ...state,
    contacts: updatedStateContacts,
  };
};

export const collectDocumentAction = (
  state: PatientState,
  payload: CollectDocumentActionPayload,
) => {
  const {patientId, documents} = payload;

  const updatedStateDocuments = {...state.documents};

  //  Init the patient document collection container if needed
  if (!updatedStateDocuments[patientId]) {
    updatedStateDocuments[patientId] = {};
  }

  //  Group content by documentId
  const contentGroupedByDocumentId = groupBy(documents, 'documentId');

  for (const docId in contentGroupedByDocumentId) {
    //  Init the patient documentId list if needed
    if (!updatedStateDocuments[patientId][docId]) {
      updatedStateDocuments[patientId][docId] = {};
    }

    const attachmentsContent: {
      [attachmentId: string]: string;
    } = {};

    contentGroupedByDocumentId[docId].forEach(docContent => {
      if (!!docContent.attachmentId && !!docContent.url) {
        attachmentsContent[docContent.attachmentId!!] = docContent.url;
      }
    });

    updatedStateDocuments[patientId][docId] = {
      ...updatedStateDocuments[patientId][docId],
      ...attachmentsContent,
    };
  }

  return {...state, documents: {...updatedStateDocuments}};
};
