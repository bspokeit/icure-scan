import { Contact, Patient } from '@icure/api';
import { compact, fromPairs, last, toLower } from 'lodash';
import { useContext } from 'react';
import { getApi as api } from '../api/icure';
import { DOCUMENT_SERVICE_TAGS } from '../constant';
import { Context as AuthContext } from '../context/AuthContext';
import { Context as ImportContext } from '../context/ImportContext';
import { Context as PatientContext } from '../context/PatientContext';
import { ImportStatus } from '../context/reducer-action/ImportReducerActions';
import {
  ImportTask,
  ImportTaskDocument,
  ImportTaskStatus,
  ImportTaskType,
} from '../models/core/import-task.model';
import { URI2Blob } from '../utils/formatHelper';

// TODO: better handle error in the flow and cleanup if something goes wrong

export default () => {
  const {
    state: { currentUser },
  } = useContext(AuthContext);

  const { collectContacts } = useContext(PatientContext);

  const {
    state: { documents },
    setStatus,
    setTasks,
    updateTask,
    setFinal,
  } = useContext(ImportContext);

  const buildNewContact = async (patient: Patient) => {
    try {
      const newContact = await api().contactApi.newInstance(
        currentUser!!,
        patient,
        {
          author: currentUser!!.id,
          responsible: currentUser!!.healthcarePartyId,
          subContacts: [],
          services: [],
        }
      );

      return newContact;
    } catch (e) {
      throw e;
    }
  };

  //  TODO: cleanup this function and figure out if the message is required
  const buildNewDocument = async (image: ImportTaskDocument) => {
    const ext = last(image.uri!!.split('.')) || 'jpg';
    let mimeType = toLower(ext);
    mimeType =
      mimeType === 'jpg' ? 'jpeg' : mimeType === 'tif' ? 'tiff' : mimeType;
    try {
      const document = await api().documentApi.newInstance(
        currentUser!!,
        await api().messageApi.newInstance(currentUser!!, {}),
        {
          name: `${api().cryptoApi.randomUuid()}-from-icure-scan`,
          mainUti: api().documentApi.uti(
            mimeType === 'pdf' ? 'application/pdf' : 'image/' + mimeType,
            ext
          ),
        }
      );

      return await api().documentApi.createDocument(document);
    } catch (e) {
      throw e;
    }
  };

  const processTask = async (task: ImportTask) => {
    let service = null;
    let status = { succesfull: true, error: null };

    try {
      const document = await buildNewDocument(task.document!!);

      if (!document) {
        throw new Error(`Impossible to create Document for task: ${task}`);
      }

      await api().documentApi.setDocumentAttachment(
        document.id!!,
        '',
        (await URI2Blob(task.document!!.uri)) as any
      );

      service = api()
        .contactApi.service()
        .newInstance(currentUser!!, {
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

    updateTask(task.id, ImportTaskStatus.Done);

    return {
      service,
      status,
    };
  };

  const cleanImportSetup = async () => {
    setTasks([]);
    setFinal(undefined);
    setStatus(ImportStatus.Pending);
  };

  const startImport = async (patient: Patient) => {
    cleanImportSetup();
    setStatus(ImportStatus.Ongoing);

    const tasks: Array<ImportTask> = documents.map((doc) => {
      return new ImportTask({ document: doc });
    });

    setTasks(tasks);

    const services = [];

    try {
      for (const task of tasks) {
        const { service } = await processTask(task);
        services.push(service);
      }
    } catch (error) {
      console.error(error);
    }

    const closingTasks = new ImportTask({ type: ImportTaskType.Final });
    setFinal(closingTasks);

    try {
      const contact = await buildNewContact(patient);

      contact.services = compact([...services]);
      contact.subContacts = [
        {
          status: 64,
          services: services.map((s) => {
            return { serviceId: s.id };
          }),
        },
      ];

      const newContact: Contact = await api().contactApi.createContactWithUser(
        currentUser!!,
        contact
      );

      collectContacts({ patientId: patient.id!!, contacts: [newContact] });
    } catch (error) {
      console.error(error);
    }

    setFinal({ ...closingTasks, status: ImportTaskStatus.Done });

    setStatus(ImportStatus.Done);
  };

  return { startImport, cleanImportSetup };
};
