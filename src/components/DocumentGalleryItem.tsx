/*
 * Copyright (C) 2022 Bspoke IT SRL
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

import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import ImageView from 'react-native-image-viewing';
import { DEFAULT_BORDER, DEFAULT_IMAGE_BACKGROUND } from '../constant';
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
        style={[styles.container, styles.imageContainerStyle, styles.imageStyle, styles.imagePlaceholderStyle]}></View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.imageContainerStyle}>
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => {
            setFullScreen(true);
          }}>
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
    borderRadius: DEFAULT_BORDER,
  },
  imagePlaceholderStyle: {
    backgroundColor: DEFAULT_IMAGE_BACKGROUND,
  },
});

export default DocumentGalleryItem;
