import React, { useEffect, useState } from 'react';
import { FlatList, Modal, StyleSheet, View } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import {
  getDocumentIdFromService,
  getDocumentServices,
} from '../utils/contactHelper';
import GalleryGridItem from './GalleryGridItem';

const DocumentGallery = ({ patient, contact }) => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    setServices(getDocumentServices(contact));
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.flatListStyle}
        numColumns={3}
        keyExtractor={(item) => item.id}
        data={services}
        renderItem={({ item }) => {
          return (
            <GalleryGridItem
              patientId={patient.id}
              documentId={getDocumentIdFromService(item)}
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
