import { uniqBy, groupBy, orderBy } from 'lodash';

export const collectContactsAction = (state, action) => {
  const { patientId, contacts } = action.payload;

  const updatedStateContacts = { ...state.contacts };

  //  Init the patient contacts list if needed
  if (!updatedStateContacts[patientId]) {
    updatedStateContacts[patientId] = [];
  }

  //  Collect the patient contacts
  updatedStateContacts[patientId] = orderBy(
    uniqBy([...updatedStateContacts[patientId], ...contacts], 'id'),
    ['created'],
    ['desc']
  );

  // And return the updated state
  return {
    ...state,
    contacts: updatedStateContacts,
  };
};

/**
 * The state object assumes the following structure:
 *  state = {
 *      patientId: {
 *          documentId: {
 *              attachmentId: Base64 string,
 *              ...
 *          }
 *          ...
 *      }
 *      ...
 *  }
 *
 *  The action object assumes the following structure:
 *  action = {
 *      patientId: string,
 *      documents: [{
 *              documentId: string,
 *              attachmentId: string,
 *              url: Base64 string
 *          },
 *          ...
 *      ]
 *  }
 */
export const collectDocumentAction = (state, action) => {
  const { patientId, documents } = action.payload;

  const updatedStateDocuments = { ...state.documents };

  //  Init the patient document collection container if needed
  if (!updatedStateDocuments[patientId]) {
    updatedStateDocuments[patientId] = {};
  }

  //  Group content by documentId
  const contentGroupedByDocumentId = groupBy(documents, 'documentId');

  for (const docId in contentGroupedByDocumentId) {
    //  Init the patient documentId list if needed
    if (!updatedStateDocuments[patientId][docId]) {
      updatedStateDocuments[patientId][docId] = {};
    }

    const attachmentsContent = {};
    contentGroupedByDocumentId[docId].forEach((docContent) => {
      attachmentsContent[docContent.attachmentId] = docContent.url;
    });

    updatedStateDocuments[patientId][docId] = {
      ...updatedStateDocuments[patientId][docId],
      ...attachmentsContent,
    };
  }

  return { ...state, documents: { ...updatedStateDocuments } };
};
