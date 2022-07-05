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

import { Avatar } from '@rneui/base';
import React, { useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { DEFAULT_BORDER, DEFAULT_IMAGE_BACKGROUND } from '../constant';
import useDocument from '../hooks/useDocument';

interface Props {
  patientId: string;
  documentId?: string;
}

const DocumentAvatar: React.FC<Props> = ({patientId, documentId}) => {
  const {fetchDocument, documentContent} = useDocument();

  useEffect(() => {
    if (!!documentId) {
      fetchDocument(patientId, documentId);
    }
  }, [documentId]);

  if (!documentId || !documentContent(patientId, documentId)) {
    return (
      <View>
        <Avatar
          containerStyle={styles.default}
          size="medium"
          icon={{
            name: 'hourglass-end',
            type: 'font-awesome',
            size: 24,
            color: 'white',
          }}
        />
      </View>
    );
  }

  return (
    <View>
      <Image
        style={styles.image}
        source={{
          uri: documentContent(patientId, documentId)!!,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  default: {
    backgroundColor: DEFAULT_IMAGE_BACKGROUND,
    borderRadius: DEFAULT_BORDER,
  },
  image: {
    height: 50,
    width: 50,
    borderRadius: DEFAULT_BORDER,
  },
});

export default DocumentAvatar;
