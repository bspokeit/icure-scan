import React, { useContext, useEffect } from 'react';
import { ActivityIndicator, Image, StyleSheet, View } from 'react-native';
import { Context as PatientContext } from '../context/PatientContext';
import useDocumentResolver from '../hooks/useDocumentResolver';

const DocumentListItem = ({ documentId }) => {
  const {
    state: { resolvedDocuments },
  } = useContext(PatientContext);
  const { fetchDocument } = useDocumentResolver();
  useEffect(() => {
    fetchDocument(documentId);
  }, []);
  return (
    <View>
      {resolvedDocuments &&
      resolvedDocuments[documentId] &&
      resolvedDocuments[documentId].content ? (
        <Image
          style={styles.imageStyle}
          source={{
            uri: resolvedDocuments[documentId]?.content,
          }}
        />
      ) : (
        <ActivityIndicator
          style={styles.imageStyle}
          animating
          color="#2089dc"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  flatListStyle: {
    backgroundColor: 'white',
  },
  imageContainerStyle: {
    flex: 1,
    margin: 1,
  },
  imageStyle: {
    height: 120,
    width: '100%',
  },
});

export default DocumentListItem;
