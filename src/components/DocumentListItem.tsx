import React, { useEffect } from 'react';
import { View } from 'react-native';
import { Avatar } from 'react-native-elements';
import useDocument from '../hooks/useDocument';

interface Props {
  patientId: string;
  documentId?: string;
}

const DocumentListItem: React.FC<Props> = ({ patientId, documentId }) => {
  const { fetchDocument, documentContent } = useDocument();

  useEffect(() => {
    if (!!documentId) {
      fetchDocument(patientId, documentId);
    }
  }, [documentId]);

  if (!documentId || !documentContent(patientId, documentId)) {
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
          uri: documentContent(patientId, documentId)!!,
        }}
        size="medium"
      />
    </View>
  );
};

export default DocumentListItem;
