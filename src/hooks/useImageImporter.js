import { last, toLower, fromPairs } from 'lodash';
import { useContext } from 'react';
import { getApi as api } from '../api/icure';
import { Context as AuthContext } from '../context/AuthContext';
import { Context as PatientContext } from '../context/PatientContext';
import { URI2Blob } from '../utils/formatHelper';
import moment from 'moment';

export default () => {
  const {
    state: { currentUser },
  } = useContext(AuthContext);

  const {
    state: { images },
  } = useContext(PatientContext);

  const buildNewContact = async (patient) => {
    try {
      const newContact = await api().contactApi.newInstance(
        currentUser,
        patient,
        {
          author: currentUser.id,
          responsible: currentUser.healthcarePartyId,
          subContacts: [],
          services: [],
        }
      );

      return newContact;
    } catch (e) {
      throw e;
    }
  };

  const buildNewDocument = async (image) => {
    const ext = last(image.uri.split('.'));
    let mimeType = toLower(ext);
    mimeType =
      mimeType === 'jpg' ? 'jpeg' : mimeType === 'tif' ? 'tiff' : mimeType;
    try {
      const document = await api().documentApi.newInstance(currentUser, null, {
        name: `${api().cryptoApi.randomUuid()}-from-icure-scan`,
        mainUti: api().documentApi.uti(
          mimeType === 'pdf' ? 'application/pdf' : 'image/' + mimeType,
          ext
        ),
      });

      return await api().documentApi.createDocument(document);
    } catch (e) {
      throw e;
    }
  };

  const startImport = async (patient) => {
    try {
      const imageTest = images[0];

      const newContact = await buildNewContact(patient);

      const document = await buildNewDocument(imageTest);

      await api().documentApi.setDocumentAttachment(
        document.id,
        '',
        await URI2Blob(imageTest.uri)
      );

      const service = api()
        .contactApi.service()
        .newInstance(currentUser, {
          content: fromPairs([
            [
              'fr', // TODO: fix this hardcoding...
              {
                documentId: document.id,
                stringValue: document.name,
              },
            ],
          ]),
          tags: [
            {
              type: 'CD-TRANSACTION',
              code: imageTest.type || 'icure-scan-import',
            },
          ],
          label: 'imported document',
        });

      newContact.services.push(service);
      newContact.subContacts.push({
        status: 64,
        services: [{ serviceId: service.id }],
      });

      await api().contactApi.createContactWithUser(currentUser, newContact);
    } catch (err) {
      console.error(err);
    }
  };

  return { startImport: startImport };
};
