import { compact, fromPairs, last, toLower } from 'lodash';
import { useContext } from 'react';
import { getApi as api } from '../api/icure';
import { Context as AuthContext } from '../context/AuthContext';
import { Context as PatientContext } from '../context/PatientContext';
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
    state: { images },
    setImportStatus,
    setImportTasks,
    setClosingTask,
    updateTaskStatus,
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

  const processTask = async (task) => {
    let service = null;
    let subContact = null;
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
          tags: [
            {
              type: 'CD-TRANSACTION',
              code: task.image.type || 'icure-scan-import',
            },
          ],
          label: 'imported document',
        });

      subContact = {
        status: 64,
        services: [{ serviceId: service.id }],
      };
    } catch (e) {
      status = {
        succesfull: false,
        error: e,
      };
      console.log(e);
    }

    updateTaskStatus(task.id, 'DONE');

    return {
      service,
      subContact,
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

    const tasks = images.map((image) => {
      return {
        id: taskID(),
        image,
        type: 'DOCUMENT_IMPORT',
        importStatus: 'PENDING',
      };
    });

    setImportTasks(tasks);

    const services = [];
    const subContacts = [];

    try {
      for (const task of tasks) {
        const { service, subContact } = await processTask(task);
        services.push(service);
        subContacts.push(subContact);
      }
    } catch (e) {
      console.log(e);
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
      newContact.subContacts = compact([...subContacts]);

      await api().contactApi.createContactWithUser(currentUser, newContact);
    } catch (err) {
      console.error(err);
    }

    setClosingTask({ ...closingTasks, importStatus: 'DONE' });

    setImportStatus('DONE');
  };

  return { startImport, cleanImportSetup };
};
