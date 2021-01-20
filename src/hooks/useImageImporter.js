import { last } from 'lodash';
import { useContext } from 'react';
import { getApi as api } from '../api/icure';
import { Context as AuthContext } from '../context/AuthContext';
import { Context as PatientContext } from '../context/PatientContext';
import { URI2Blob } from '../utils/formatHelper';

export default () => {
  const {
    state: { currentUser },
  } = useContext(AuthContext);

  const {
    state: { images },
  } = useContext(PatientContext);

  const startImport = async () => {
    try {
      const imageTest = images[0];
      console.log('imageTest: ', imageTest.uri);

      const extention = last(imageTest.uri.split('.'));
      console.log('Extention: ', extention);

      const documentDto = await api().documentApi.newInstance(
        currentUser,
        null,
        {
          name: 'test',
          mainUti: api().documentApi.uti(null, extention), // TODO: Type could be infered from the camera/media library
        }
      );
      console.log('DocumentDTO created');

      const savedDocumentDto = await api().documentApi.createDocument(
        documentDto
      );

      console.log('DocumentDTO uploaded: ', imageTest.base64.substring(0, 30));

      const blob = await URI2Blob(imageTest.uri);

      await api().documentApi.setDocumentAttachment(
        savedDocumentDto.id,
        '',
        blob
      );

      console.log('Attachment uploaded');

      const finalDocument = await api().documentApi.getDocument(
        savedDocumentDto.id
      );
      console.log('Final document ready: ', finalDocument);
    } catch (err) {
      console.error(err);
    }
  };

  return { startImport: startImport };
};
