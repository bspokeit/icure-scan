import * as _ from 'lodash';
import { findIndex } from 'lodash';
import { DOCUMENT_SERVICE_TAGS } from '../constant';
import { Contact, Service } from '../models';

export const extractContactServices = (contact: Contact): Service[] => {
  if (!contact || !contact.services || !contact.services.length) {
    return [];
  }

  const docServices = _.filter(contact.services || [], (s) => {
    return (
      !!s &&
      !!s.id &&
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

  return docServices as Service[];
};

export const extractDocumentIdFromService = (
  service: Service
): string | undefined => {
  return service?.content?.fr?.documentId ?? undefined;
};
