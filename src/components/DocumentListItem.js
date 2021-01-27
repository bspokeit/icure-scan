import React, { useContext, useEffect } from 'react';
import { View } from 'react-native';
import { Avatar } from 'react-native-elements';
import { Context as PatientContext } from '../context/PatientContext';
import useDocumentResolver from '../hooks/useDocumentResolver';
import { isEmpty } from 'lodash';

const DocumentListItem = ({ patientId, documentId }) => {
  const {
    state: { documents },
  } = useContext(PatientContext);
  const { fetchDocument } = useDocumentResolver();

  useEffect(() => {
    if (!!documentId) {
      fetchDocument(patientId, documentId);
    }
  }, [documentId]);

  const getContent = () => {
    //  Currently we take the first content for a given documentId. In the future, we might support
    //  multi content (multi attachment) document.
    const documentContent =
      documents && documents[patientId] && documents[patientId][documentId]
        ? documents[patientId][documentId]
        : {};

    return !isEmpty(documentContent)
      ? documentContent[Object.keys(documentContent)[0]]
      : null;
  };

  return (
    <View>
      {getContent() ? (
        <Avatar
          source={{
            uri: getContent(),
          }}
          size="medium"
        />
      ) : (
        <Avatar
          size="medium"
          icon={{
            name: 'hourglass-end',
            type: 'font-awesome',
            size: 24,
            color: 'grey',
          }}
        />
      )}
    </View>
  );
};

export default DocumentListItem;
