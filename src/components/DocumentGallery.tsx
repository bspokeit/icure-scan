/*
 * Copyright (C) 2021 Bspoke IT SRL
 *
 * This file is part of icure-scan.
 *
 * icure-scan is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * icure-scan is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with icure-scan.  If not, see <http://www.gnu.org/licenses/>.
 */

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
