import { Contact, Service } from '@icure/api';
import { findIndex } from 'lodash';
import { DOCUMENT_SERVICE_TAGS } from '../constant';

export const extractContactServices = (contact: Contact): Service[] => {
  if (!contact || !contact.services || !contact.services.length) {
    return [];
  }

  const docServices = contact.services.filter((s: Service) => {
    return (
      !!s &&
      !!s.tags &&
      s.tags.length >= 2 &&
      DOCUMENT_SERVICE_TAGS.every((docTag) => {
        return (
          findIndex(
            s.tags,
            (t) => t.type === docTag.type && t.code === docTag.code
          ) > -1
        );
      })
    );
  });

  return docServices;
};

export const extractDocumentIdFromService = (
  service: Service
): string | undefined => {
  return service?.content?.fr?.documentId ?? undefined;
};
