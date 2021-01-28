import React from 'react';
import { FlatList, Modal, StyleSheet, View } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import useDocumentResolver from '../hooks/useDocumentResolver';
import GalleryGridItem from './GalleryGridItem';

const DocumentGallery = ({ patient, contact }) => {
  const { fetchContactDocumentIds } = useDocumentResolver();

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.flatListStyle}
        numColumns={3}
        keyExtractor={(item) => item}
        data={fetchContactDocumentIds(contact)}
        renderItem={({ item }) => {
          return (
            <GalleryGridItem
              patientId={patient.id}
              documentId={item}
            ></GalleryGridItem>
          );
        }}
      />

      <Modal visible={false} transparent={true}>
        {/* <ImageViewer imageUrls={images} /> */}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatListStyle: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export default DocumentGallery;
