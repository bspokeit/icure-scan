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

import _ from 'lodash';
import { useContext } from 'react';
import { getAPI as api } from '../api/icure';
import { DOCUMENT_SERVICE_TAGS } from '../constant';
import { Context as AuthContext } from '../context/AuthContext';
import { Context as ImportContext } from '../context/ImportContext';
import { Context as PatientContext } from '../context/PatientContext';
import { ImportStatus } from '../context/reducer-action/ImportReducerActions';
import { Contact, Document, Patient } from '../models';
import {
  ImportTask,
  ImportTaskDocument,
  ImportTaskStatus,
  ImportTaskType,
  ProcessTaskNewContent,
} from '../models/core/import-task.model';
import { URI2Blob } from '../utils/formatHelper';

export default () => {
  const {
    state: { currentUser },
  } = useContext(AuthContext);

  const { collectContacts } = useContext(PatientContext);

  const {
    state: { documents },
    setStatus,
    setTasks,
    updateTask,
    setFinal,
    reset,
  } = useContext(ImportContext);

  const buildNewContact = async (patient: Patient) => {
    try {
      const newContact = await api().contactApi.newInstance(currentUser!!, patient, {
        author: currentUser!!.id,
        responsible: currentUser!!.healthcarePartyId,
        subContacts: [],
        services: [],
      });

      return newContact;
    } catch (e) {
      throw e;
    }
  };

  //  TODO: cleanup this function and figure out if the message is required
  const buildNewDocument = async (image: ImportTaskDocument) => {
    const ext = _.last(image.uri!!.split('.')) || 'jpg';
    let mimeType = _.toLower(ext);
    mimeType = mimeType === 'jpg' ? 'jpeg' : mimeType === 'tif' ? 'tiff' : mimeType;
    try {
      const document = await api().documentApi.newInstance(currentUser!!, undefined, {
        name: `${api().cryptoApi.randomUuid()}-from-icure-scan`,
        mainUti: api().documentApi.uti(mimeType === 'pdf' ? 'application/pdf' : 'image/' + mimeType, ext),
      });

      return await api().documentApi.createDocument(document);
    } catch (e) {
      throw e;
    }
  };

  const processTask = async (task: ImportTask, newContent: ProcessTaskNewContent): Promise<void> => {
    try {
      const document: Document = new Document(await buildNewDocument(task.document!!));

      console.log('document: ', document);

      if (!document) {
        throw new Error(`Impossible to create Document for task: ${task}`);
      }
      newContent.documents.push(document);

      const clearAttachment = await URI2Blob(task.document!!.uri!!);

      console.log('boum: ', clearAttachment);

      const ekeys = await api().cryptoApi.extractKeysFromDelegationsForHcpHierarchy(
        currentUser!!.healthcarePartyId!!,
        document.id,
        document.encryptionKeys!!,
      );

      await api().documentApi.setDocumentAttachmentBody(
        document.id,
        _.chain(ekeys.extractedKeys)
          .map(ek => {
            return ek;
          })
          .uniq()
          .join(',')
          .value(),
        clearAttachment as any,
      );

      const service = api()
        .contactApi.service()
        .newInstance(currentUser!!, {
          content: _.fromPairs([
            [
              'fr', // TODO: fix this hardcoding...
              {
                documentId: document.id,
                stringValue: document.name,
              },
            ],
          ]),
          tags: DOCUMENT_SERVICE_TAGS,
          label: 'imported document',
        });

      if (!service) {
        throw new Error(`Impossible to create Service for document: ${document}`);
      }

      newContent.services.push(service);
      updateTask(task.id, ImportTaskStatus.Done);
    } catch (error) {
      console.error(error);
      updateTask(task.id, ImportTaskStatus.Done);
      throw error;
    }
  };

  const startImport = async (patient: Patient) => {
    reset();
    setStatus(ImportStatus.Ongoing);

    const tasks: Array<ImportTask> = documents.map(doc => {
      return new ImportTask({ document: doc });
    });

    setTasks(tasks);

    //  This object is responsible to collect all new content for further treatment or cleanup
    const newContent: ProcessTaskNewContent = {
      services: [],
      documents: [],
    };

    try {
      for (const task of tasks) {
        await processTask(task, newContent);
      }
    } catch (error) {
      //  Something wrong happened. The import flow should be stopped and created object cleaned up.
      console.error(error);
      return cleanAfterError(newContent);
    }

    const closingTasks = new ImportTask({ type: ImportTaskType.Final });
    setFinal(closingTasks);

    try {
      const contact = await buildNewContact(patient);
      contact.services = _.chain(newContent.services).compact().value();
      contact.subContacts = [
        {
          status: 64,
          services: contact.services.map(s => {
            return { serviceId: s.id };
          }),
        },
      ];

      const newContact: Contact = await api().contactApi.createContactWithUser(currentUser!!, contact);

      newContent.contact = newContact;

      setFinal({ ...closingTasks, status: ImportTaskStatus.Done });

      collectContacts({ patientId: patient.id, contacts: [newContact] });
    } catch (error) {
      //  Something wrong happened. The import flow should be stopped and created object cleaned up.
      console.error(error);
      setFinal({ ...closingTasks, status: ImportTaskStatus.Done });
      return cleanAfterError(newContent);
    }

    setStatus(ImportStatus.Done);
  };

  /**
   * Note: currently the server returns 500 Internal Servor Error on delete requests...
   * The triggers a exception from the XHRError construtor of the icc-api
   * (error.message is not defined and conflict with defined typings...)
   */
  const cleanAfterError = async (contentToClean: ProcessTaskNewContent): Promise<void> => {
    const documentIdsToClean = _.chain(contentToClean.documents).compact().map('id').compact().value();

    const contactToClean = contentToClean.contact;

    try {
      for (const docId of documentIdsToClean) {
        try {
          await api().documentApi.deleteAttachment(docId);
        } catch (error) {
          //  Nothing else to do...
        }
      }
      await api().documentApi.deleteDocument(documentIdsToClean.join(','));
    } catch (error) {
      //  Nothing else to do...
    }

    if (contactToClean && contactToClean.id) {
      try {
        await api().contactApi.deleteContacts(contactToClean.id);
      } catch (error) {
        //  Nothing else to do...
      }
    }

    setStatus(ImportStatus.Error);
  };

  return { startImport };
};
