import React, { useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Avatar } from 'react-native-elements';
import { DEFAULT_BORDER, DEFAULT_IMAGE_BACKGROUND } from '../constant';
import useDocument from '../hooks/useDocument';

interface Props {
  patientId: string;
  documentId?: string;
}

const DocumentAvatar: React.FC<Props> = ({ patientId, documentId }) => {
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
          containerStyle={styles.default}
          size="medium"
          icon={{
            name: 'hourglass-end',
            type: 'font-awesome',
            size: 24,
            color: 'white',
          }}
        />
      </View>
    );
  }

  return (
    <View>
      <Image
        style={styles.image}
        source={{
          uri: documentContent(patientId, documentId)!!,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  default: {
    backgroundColor: DEFAULT_IMAGE_BACKGROUND,
    borderRadius: DEFAULT_BORDER,
  },
  image: {
    height: 50,
    width: 50,
    borderRadius: DEFAULT_BORDER,
  },
});

export default DocumentAvatar;
