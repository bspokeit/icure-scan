import { useContext } from 'react';
import { getApi as api } from '../api/icure';
import { Context as PatientContext } from '../context/PatientContext';
import {
  extractContactServices,
  extractDocumentIdFromService,
} from '../utils/contactHelper';
import { uniq } from 'lodash';

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
        documents: [{ documentId, attachmentId, content: null }],
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
            content: attachmentURL,
          },
        ],
      });
    } catch (error) {
      console.error(error);
    }
  };

  const fetchContactDocumentIds = (contact) => {
    const services = extractContactServices(contact);
    return uniq(services.map(extractDocumentIdFromService));
  };

  return { fetchDocument, fetchContactDocumentIds };
};
