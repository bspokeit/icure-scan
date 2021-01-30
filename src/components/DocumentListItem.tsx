import { isEmpty } from 'lodash';
import React, { useContext, useEffect } from 'react';
import { View } from 'react-native';
import { Avatar } from 'react-native-elements';
import { Context as PatientContext } from '../context/PatientContext';
import useDocument from '../hooks/useDocument';

interface Props {
  patientId: string;
  documentId?: string;
}

const DocumentListItem: React.FC<Props> = ({ patientId, documentId }) => {
  const {
    state: { documents },
  } = useContext(PatientContext);
  const { fetchDocument } = useDocument();

  useEffect(() => {
    if (!!documentId) {
      fetchDocument(patientId, documentId);
    }
  }, [documentId]);

  const getContent = (docId?: string) => {
    //  Currently we take the first content for a given documentId. In the future, we might support
    //  multi content (multi attachment) document.

    if (!docId) {
      return null;
    }

    const documentContent =
      documents && documents[patientId] && documents[patientId][docId]
        ? documents[patientId][docId]
        : {};

    return !isEmpty(documentContent)
      ? documentContent[Object.keys(documentContent)[0]]
      : null;
  };

  if (!documentId || !getContent(documentId)) {
    return (
      <View>
        <Avatar
          size="medium"
          icon={{
            name: 'hourglass-end',
            type: 'font-awesome',
            size: 24,
            color: 'grey',
          }}
        />
      </View>
    );
  }

  return (
    <View>
      <Avatar
        source={{
          uri: getContent(documentId)!!,
        }}
        size="medium"
      />
    </View>
  );
};

export default DocumentListItem;
