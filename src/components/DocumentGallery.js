import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text } from 'react-native';
import GalleryGridItem from './GalleryGridItem';
import {
  getDocumentIdFromService,
  getDocumentServices,
} from '../utils/contactHelper';

const DocumentGallery = ({ patient, contact }) => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    setServices(getDocumentServices(contact));
  }, []);

  return (
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
  );
};

const styles = StyleSheet.create({
  flatListStyle: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export default DocumentGallery;
