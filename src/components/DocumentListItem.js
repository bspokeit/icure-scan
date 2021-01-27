import React, { useContext, useEffect } from 'react';
import { View } from 'react-native';
import { Avatar } from 'react-native-elements';
import { Context as PatientContext } from '../context/PatientContext';
import useDocumentResolver from '../hooks/useDocumentResolver';

const DocumentListItem = ({ documentId }) => {
  const {
    state: { resolvedDocuments },
  } = useContext(PatientContext);
  const { fetchDocument } = useDocumentResolver();

  useEffect(() => {
    if (!!documentId) {
      fetchDocument(documentId);
    }
  }, [documentId]);

  return (
    <View>
      {resolvedDocuments &&
      resolvedDocuments[documentId] &&
      resolvedDocuments[documentId].content ? (
        <Avatar
          source={{
            uri: resolvedDocuments[documentId]?.content,
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
