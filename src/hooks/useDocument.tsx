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

import _ from 'lodash';
import { useContext } from 'react';
import { getAPI as api } from '../api/icure';
import { Context as AuthContext } from '../context/AuthContext';
import { Context as PatientContext } from '../context/PatientContext';
import { Contact, Patient } from '../models';
import {
  extractContactServices,
  extractDocumentIdFromService,
} from '../utils/contactHelper';

export default () => {
  const {
    state: { documents },
    collectDocuments,
  } = useContext(PatientContext);

  const {
    state: { currentUser },
  } = useContext(AuthContext);

  const fetchDocument = async (
    patientId: string,
    documentId: string
  ): Promise<void> => {
    if (documents[patientId] && documents[patientId][documentId]) {
      return;
    }

    try {
      const {
        attachmentId,
        encryptionKeys,
      } = await api().documentApi.getDocument(documentId);

      if (!attachmentId) {
        return;
      }

      collectDocuments({
        patientId,
        documents: [{ documentId, attachmentId, url: undefined }],
      });

      const keys = await api().cryptoApi.extractKeysFromDelegationsForHcpHierarchy(
        currentUser!!.healthcarePartyId!!,
        documentId,
        encryptionKeys!!
      );

      const attachmentURL = await api().documentApi.getAttachmentUrl(
        documentId,
        attachmentId,
        [keys.extractedKeys[0]] as any
      );

      collectDocuments({
        patientId,
        documents: [
          {
            documentId,
            attachmentId,
            url: attachmentURL,
          },
        ],
      });
    } catch (error) {
      console.error(error);
    }
  };

  const fetchContactDocumentIds = (contact: Contact) => {
    return _.chain(extractContactServices(contact))
      .map(extractDocumentIdFromService)
      .compact()
      .uniq()
      .value();
  };

  const fetchContactAttachmentURLs = (
    patient: Patient,
    contact: Contact
  ): Array<{ url: string }> => {
    const documentIds = fetchContactDocumentIds(contact);

    if (!patient.id) {
      return [];
    }

    if (!documentIds || !documentIds.length || !documents[patient.id]) {
      return [];
    }

    const formattedUrls = _.chain(documentIds)
      .map((docId) => {
        return documents[patient.id][docId];
      })
      .map((dc) => {
        return !!dc ? Object.values(dc) : undefined;
      })
      .flatMap()
      .compact()
      .uniq()
      .value();

    return formattedUrls.map((v: string) => ({ url: v }));
  };

  //  Currently we take the first content for a given documentId. In the future, we might support
  //  multi content (multi attachment) document.
  const documentContent = (patientId: string, documentId: string) => {
    const docContent =
      documents && documents[patientId] && documents[patientId][documentId]
        ? documents[patientId][documentId]
        : {};

    return !_.isEmpty(docContent)
      ? docContent[Object.keys(docContent)[0]]
      : null;
  };

  return {
    fetchDocument,
    fetchContactDocumentIds,
    fetchContactAttachmentURLs,
    documentContent,
  };
};
