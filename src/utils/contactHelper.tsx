import { CodeStub, Contact, Service } from '@icure/api';
import { findIndex } from 'lodash';

export const DOCUMENT_SERVICE_TAG: CodeStub[] = [
  { code: 'document', id: 'CD-ITEM|document|1', type: 'CD-ITEM', version: '1' },
  { code: 'Plan', id: 'SOAP|Plan|1', type: 'SOAP', version: '1' },
];

export const extractContactServices = (contact: Contact): Service[] => {
  if (!contact || !contact.services || !contact.services.length) {
    return [];
  }

  const docServices = contact.services.filter((s: Service) => {
    return (
      !!s &&
      !!s.tags &&
      s.tags.length >= 2 &&
      DOCUMENT_SERVICE_TAG.every((docTag) => {
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
