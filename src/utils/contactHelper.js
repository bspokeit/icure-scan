export const DOCUMENT_SERVICE_TAG = [
  { code: 'document', id: 'CD-ITEM|document|1', type: 'CD-ITEM', version: '1' },
  { code: 'Plan', id: 'SOAP|Plan|1', type: 'SOAP', version: '1' },
];

export const getDocumentServices = (contact) => {
  if (!contact || !contact.services || !contact.services.length) {
    return [];
  }

  const docServices = contact.services.filter((s) => {
    return (
      !!s &&
      !!s.tags &&
      s.tags.length >= 2 &&
      DOCUMENT_SERVICE_TAG.every((docTag) => {
        return (
          s.tags.findIndex((sTag) => {
            return sTag.type === docTag.type && sTag.code === docTag.code;
          }) > -1
        );
      })
    );
  });

  return docServices;
};

export const getDocumentIdFromService = (service) => {
  return service?.content?.fr?.documentId || '';
};
