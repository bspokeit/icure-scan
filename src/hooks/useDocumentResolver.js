import { useContext } from 'react';
import { getApi as api } from '../api/icure';
import { Context as PatientContext } from '../context/PatientContext';
import { hexToBase64 } from '../utils/formatHelper';

export default () => {
  const {
    state: { resolvedDocuments },
    collectResolvedDocument,
  } = useContext(PatientContext);

  const fetchDocument = async (documentId) => {
    if (!!resolvedDocuments && resolvedDocuments[documentId]) {
      return;
    }
    try {
      const { attachmentId } = await api().documentApi.getDocument(documentId);
      collectResolvedDocument({ documentId, attachmentId, content: null });
      const contentAsArrayBuffer = await api().documentApi.getAttachmentAs(
        documentId,
        attachmentId
      );

      const content = `data:image/jpeg;base64,${hexToBase64(
        api().cryptoApi.utils.ua2hex(contentAsArrayBuffer)
      )}`;

      collectResolvedDocument({
        documentId,
        attachmentId,
        content,
      });
    } catch (e) {
      console.log(e);
    }
  };
  return { fetchDocument };
};
