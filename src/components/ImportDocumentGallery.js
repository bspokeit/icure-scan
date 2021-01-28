import React, { useContext } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Context as ImportContext } from '../context/ImportContext';
import { navigate } from '../utils/navigationHelper';

const ImportDocumentGallery = () => {
  const {
    state: { importDocuments },
  } = useContext(ImportContext);

  return (
    <FlatList
      style={styles.flatListStyle}
      numColumns={2}
      keyExtractor={(item) => item.uri}
      data={importDocuments}
      renderItem={({ item }) => (
        <View style={styles.imageContainerStyle}>
          <TouchableOpacity
            key={item.uri}
            style={{ flex: 1 }}
            onPress={() => {
              navigate('Draw');
            }}
          >
            <Image
              style={styles.imageStyle}
              source={{
                uri: `data:image/jpeg;base64,${item.base64}`,
              }}
            />
          </TouchableOpacity>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  flatListStyle: {
    backgroundColor: 'white',
  },
  imageContainerStyle: {
    flex: 1,
    flexDirection: 'column',
    margin: 1,
  },
  imageStyle: {
    height: 120,
    width: '100%',
  },
});

export default ImportDocumentGallery;
