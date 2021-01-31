import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import ImageView from 'react-native-image-viewing';
import { DEFAULT_IMAGE_BACKGROUND } from '../constant';
import useDocument from '../hooks/useDocument';

interface Props {
  patientId: string;
  documentId?: string;
}

const DocumentGalleryItem: React.FC<Props> = ({ patientId, documentId }) => {
  const [fullScreen, setFullScreen] = useState(false);

  const { fetchDocument, documentContent } = useDocument();

  useEffect(() => {
    if (!!documentId) {
      fetchDocument(patientId, documentId);
    }
  }, [documentId]);

  if (!documentId || !documentContent(patientId, documentId)) {
    return (
      <View
        style={[
          styles.container,
          styles.imageContainerStyle,
          styles.imageStyle,
          styles.imagePlaceholderStyle,
        ]}
      ></View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.imageContainerStyle}>
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => {
            setFullScreen(true);
          }}
        >
          <Image
            style={styles.imageStyle}
            source={{
              uri: documentContent(patientId, documentId)!!,
            }}
          />
        </TouchableOpacity>
      </View>

      <ImageView
        images={[{ uri: documentContent(patientId, documentId)!! }]}
        imageIndex={0}
        visible={fullScreen}
        onRequestClose={() => setFullScreen(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 6,
  },
  imageContainerStyle: {
    flex: 1,
  },
  imageStyle: {
    height: 140,
    width: '100%',
    borderRadius: 6,
  },
  imagePlaceholderStyle: {
    backgroundColor: DEFAULT_IMAGE_BACKGROUND,
  },
});

export default DocumentGalleryItem;
