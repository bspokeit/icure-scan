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

  const fetchDocument = async (patientId, documentId) => {
    if (documents[patientId] && documents[patientId][documentId]) {
      return;
    }

    try {
      const { attachmentId } = await api().documentApi.getDocument(documentId);
      collectDocuments({
        patientId,
        documents: [{ documentId, attachmentId, url: null }],
      });

      const attachmentURL = await api().documentApi.getAttachmentUrl(
        documentId,
        attachmentId
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

  const fetchContactDocumentIds = (contact) => {
    return _.chain(extractContactServices(contact))
      .map(extractDocumentIdFromService)
      .uniq()
      .value();
  };

  const fetchContactAttachmentURLs = (patient, contact) => {
    const documentIds = fetchContactDocumentIds(contact);

    if (!documentIds || !documentIds.length || !documents[patient.id]) {
      return [];
    }

    const formattedUrls = _.chain(documentIds)
      .map((docId) => {
        return documents[patient.id][docId];
      })
      .map((dc) => {
        return !!dc ? Object.values(dc) : null;
      })
      .flatMap()
      .uniq()
      .compact()
      .map((v) => {
        return { url: v };
      })
      .value();

    return formattedUrls;
  };

  return { fetchDocument, fetchContactDocumentIds, fetchContactAttachmentURLs };
};
