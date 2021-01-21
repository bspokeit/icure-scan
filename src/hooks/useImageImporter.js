import { fromPairs, last, toLower } from 'lodash';
import { useContext } from 'react';
import { getApi as api } from '../api/icure';
import { Context as AuthContext } from '../context/AuthContext';
import { Context as PatientContext } from '../context/PatientContext';
import { URI2Blob } from '../utils/formatHelper';
import { taskID } from '../utils/importHelper';

export default () => {
  const {
    state: { currentUser },
  } = useContext(AuthContext);

  const {
    state: { images, importTasks },
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

  const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const processTask = async (task) => {
    let service = null;
    let subContact = null;
    let status = { succesfull: true, error: null };

    await sleep(1500);

    updateTaskStatus(task.id, 'DONE');

    // try {
    //   const document = await buildNewDocument(image);

    //   await api().documentApi.setDocumentAttachment(
    //     document.id,
    //     '',
    //     await URI2Blob(image.uri)
    //   );

    //   service = api()
    //     .contactApi.service()
    //     .newInstance(currentUser, {
    //       content: fromPairs([
    //         [
    //           'fr', // TODO: fix this hardcoding...
    //           {
    //             documentId: document.id,
    //             stringValue: document.name,
    //           },
    //         ],
    //       ]),
    //       tags: [
    //         {
    //           type: 'CD-TRANSACTION',
    //           code: image.type || 'icure-scan-import',
    //         },
    //       ],
    //       label: 'imported document',
    //     });

    //   subContact = {
    //     status: 64,
    //     services: [{ serviceId: service.id }],
    //   };
    // } catch (e) {
    //   status = {
    //     succesfull: false,
    //     error: e,
    //   };
    // }

    return {
      service,
      subContact,
      status,
    };
  };

  const cleanImportSetup = async () => {
    await setImportTasks([]);
    await setClosingTask(null);
  };

  //  importStatus: 'PENDING', 'ONGOING', 'DONE'
  //  type: 'DOCUMENT_IMPORT' and 'CONTACT_IMPORT'
  const startImport = async () => {
    cleanImportSetup();

    const tasks = images.map((image, index) => {
      return {
        id: taskID(),
        type: 'DOCUMENT_IMPORT',
        image,
        importStatus: 'PENDING',
      };
    });

    await setImportTasks(tasks);

    try {
      for (const task of tasks) {
        await processTask(task);
        console.log(`Task ${task.id} done`);
      }
    } catch (e) {
      console.log(e);
    }

    const closingTasks = {
      id: taskID(),
      type: 'CONTACT_IMPORT',
      contact: null,
      importStatus: 'PENDING',
    };

    await setClosingTask(closingTasks);

    console.log('Finalisation');

    await sleep(1500);

    closingTasks.importStatus = 'DONE';

    await setClosingTask(closingTasks);

    console.log('DONE');
    // try {
    //   const imageTest = images[0];

    //   const newContact = await buildNewContact(patient);

    //   fruitsToGet.forEach(async (fruit) => {
    //     const numFruit = await getNumFruit(fruit);
    //     console.log(numFruit);
    //   });

    //   const { service, subContact, status } = await importDocument(imageTest);

    //   if (status.succesfull) {
    //     newContact.services.push(service);
    //     newContact.subContacts.push(subContact);
    //   }

    //   await api().contactApi.createContactWithUser(currentUser, newContact);
    // } catch (err) {
    //   console.error(err);
    // }
  };

  return { startImport };
};
