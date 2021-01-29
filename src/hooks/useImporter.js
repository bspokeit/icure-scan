import { compact, fromPairs, last, toLower } from 'lodash';
import { useContext } from 'react';
import { getApi as api } from '../api/icure';
import { Context as AuthContext } from '../context/AuthContext';
import { Context as ImportContext } from '../context/ImportContext';
import { DOCUMENT_SERVICE_TAGS } from '../utils/contactHelper';
import { URI2Blob } from '../utils/formatHelper';
import { taskID } from '../utils/importHelper';

//  TODO:
//    1. processTask should be based on task type
//    2. we should have a tack dedicated context
//    3. Rename image to document (more generic)
//    4. Isolate build function in an helper file ?
//    5. Create enum for status and types
//    6. Avoid copying image in the tasks
//    7. Handle failure in import flow
export default () => {
  const {
    state: { currentUser },
  } = useContext(AuthContext);

  const {
    state: { importDocuments },
    setImportStatus,
    setImportTasks,
    updateTaskStatus,
    setClosingTask,
  } = useContext(ImportContext);

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

  const processTask = async (task) => {
    let service = null;
    let status = { succesfull: true, error: null };

    try {
      const document = await buildNewDocument(task.image);

      await api().documentApi.setDocumentAttachment(
        document.id,
        '',
        await URI2Blob(task.image.uri)
      );

      service = api()
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
          tags: DOCUMENT_SERVICE_TAGS,
          label: 'imported document',
        });
    } catch (error) {
      console.error(error);
      status = {
        succesfull: false,
        error,
      };
    }

    updateTaskStatus(task.id, 'DONE');

    return {
      service,
      status,
    };
  };

  const cleanImportSetup = async () => {
    setImportTasks([]);
    setClosingTask(null);
    setImportStatus('PENDING');
  };

  const startImport = async (patient) => {
    cleanImportSetup();
    setImportStatus('ONGOING');

    const tasks = importDocuments.map((image) => {
      return {
        id: taskID(),
        image,
        type: 'DOCUMENT_IMPORT',
        importStatus: 'PENDING',
      };
    });

    setImportTasks(tasks);

    const services = [];

    try {
      for (const task of tasks) {
        const { service } = await processTask(task);
        services.push(service);
      }
    } catch (error) {
      console.error(error);
    }

    const closingTasks = {
      id: taskID(),
      type: 'CONTACT_IMPORT',
      importStatus: 'PENDING',
    };

    setClosingTask(closingTasks);

    try {
      const newContact = await buildNewContact(patient);

      newContact.services = compact([...services]);
      newContact.subContacts = [
        {
          status: 64,
          services: services.map((s) => {
            return { serviceId: s.id };
          }),
        },
      ];

      await api().contactApi.createContactWithUser(currentUser, newContact);
    } catch (error) {
      console.error(error);
    }

    setClosingTask({ ...closingTasks, importStatus: 'DONE' });

    setImportStatus('DONE');
  };

  return { startImport, cleanImportSetup };
};
