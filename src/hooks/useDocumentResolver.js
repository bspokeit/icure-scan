import { useContext } from 'react';
import { getApi as api } from '../api/icure';
import { Context as PatientContext } from '../context/PatientContext';
import { hexToBase64 } from '../utils/formatHelper';

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
      const contentAsArrayBuffer = await api().documentApi.getAttachmentAs(
        documentId,
        attachmentId
      );

      const content = `data:image/jpeg;base64,${hexToBase64(
        api().cryptoApi.utils.ua2hex(contentAsArrayBuffer)
      )}`;

      collectDocuments({
        patientId,
        documents: [
          {
            documentId,
            attachmentId,
            content,
          },
        ],
      });
    } catch (error) {
      console.error(error);
    }
  };
  return { fetchDocument };
};
