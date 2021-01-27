import { isEmpty } from 'lodash';
import React, { useContext, useEffect } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Context as PatientContext } from '../context/PatientContext';
import useDocumentResolver from '../hooks/useDocumentResolver';

const GalleryGridItem = ({ patientId, documentId }) => {
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

  if (getContent()) {
    return (
      <View style={styles.imageContainerStyle}>
        <TouchableOpacity
          key={getContent().id}
          style={{ flex: 1 }}
          onPress={() => {
            console.log('Image click !');
          }}
        >
          <Image
            style={styles.imageStyle}
            source={{
              uri: getContent(),
            }}
          />
        </TouchableOpacity>
      </View>
    );
  } else {
    return (
      <View style={styles.imageContainerStyle}>
        <View style={[styles.imageStyle, styles.imagePlaceholderStyle]} />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  imageContainerStyle: {
    flex: 1,
    flexDirection: 'column',
    margin: 1,
  },
  imageStyle: {
    height: 140,
    width: '100%',
  },
  imagePlaceholderStyle: {
    backgroundColor: 'blue',
  },
});

export default GalleryGridItem;
