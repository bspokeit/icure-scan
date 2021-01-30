import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import useDocument from '../hooks/useDocument';
import { Contact, Patient } from '../models';
import GalleryGridItem from './GalleryGridItem';

interface Props {
  patient: Patient;
  contact: Contact;
}

const DocumentGallery: React.FC<Props> = ({ patient, contact }) => {
  const { fetchContactDocumentIds } = useDocument();

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
