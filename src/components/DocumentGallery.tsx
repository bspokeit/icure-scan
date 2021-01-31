import React from 'react';
import { FlatList } from 'react-native';
import useDocument from '../hooks/useDocument';
import { Contact, Patient } from '../models';
import DocumentGalleryItem from './DocumentGalleryItem';

interface Props {
  patient: Patient;
  contact: Contact;
}

const DocumentGallery: React.FC<Props> = ({ patient, contact }) => {
  const { fetchContactDocumentIds } = useDocument();

  return (
    <FlatList
      numColumns={3}
      keyExtractor={(item) => item}
      data={fetchContactDocumentIds(contact)}
      renderItem={({ item }) => {
        return (
          <DocumentGalleryItem
            patientId={patient.id}
            documentId={item}
          ></DocumentGalleryItem>
        );
      }}
    />
  );
};

export default DocumentGallery;
