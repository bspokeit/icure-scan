import { useContext } from 'react';
import { getApi as api } from '../api/icure';
import { Context as AuthContext } from '../context/AuthContext';
import { Context as PatientContext } from '../context/PatientContext';
import { last } from 'lodash';

export default () => {
  const {
    state: { currentUser },
  } = useContext(AuthContext);

  const {
    state: { images },
  } = useContext(PatientContext);

  //   btoa(
  //     String.fromCharCode(...new Uint8Array(ab))
  //   )

  const base64ToBlob = (dataURI, type = 'application/octet-stream') => {
    // const byteNumbers = Array.prototype.map.call(atob(base64), (char) =>
    //   char.charCodeAt(0)
    // );
    // const bytes = Uint8Array.from(byteNumbers);
    // return new Blob([bytes], { type });

    var byteString = atob(dataURI);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);

    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    console.log('type: ', type);
    return new Blob([ab], { type: 'image/jpeg' });
  };

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
          mainUti: api().documentApi.uti(null, extention), // Type could be infered from the camera/media library
        }
      );
      console.log('DocumentDTO created');

      const savedDocumentDto = await api().documentApi.createDocument(
        documentDto
      );

      console.log('DocumentDTO uploaded: ', imageTest.base64.substring(0, 30));

      const response = await fetch(imageTest.uri);
      // console.log(response);
      const blob = await response.blob();

      // const blob = base64ToBlob(imageTest.base64, 'image/jpeg');
      //  Set attachment
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
