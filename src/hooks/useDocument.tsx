import { Contact, Patient } from '@icure/api';
import * as _ from 'lodash';
import { useContext } from 'react';
import { getApi as api } from '../api/icure';
import { Context as PatientContext } from '../context/PatientContext';
import {
  extractContactServices,
  extractDocumentIdFromService,
} from '../utils/contactHelper';

export default () => {
  const {
    state: { documents },
    collectDocuments,
  } = useContext(PatientContext);

  const fetchDocument = async (
    patientId: string,
    documentId: string
  ): Promise<void> => {
    if (documents[patientId] && documents[patientId][documentId]) {
      return;
    }

    try {
      const { attachmentId } = await api().documentApi.getDocument(documentId);

      if (!attachmentId) {
        return;
      }

      collectDocuments({
        patientId,
        documents: [{ documentId, attachmentId, url: undefined }],
      });

      const attachmentURL = await api().documentApi.getAttachmentUrl(
        documentId,
        attachmentId,
        []
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
        return documents[patient.id!!][docId];
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

  return { fetchDocument, fetchContactDocumentIds, fetchContactAttachmentURLs };
};