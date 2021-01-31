import React, { useContext, useRef } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { DEFAULT_BORDER, MAIN_COLOR } from '../constant';
import { Context as ImportContext } from '../context/ImportContext';
import { navigate } from '../utils/navigationHelper';

const ImportDocumentGallery: React.FC = () => {
  const flatListRef = useRef<FlatList<any>>() as React.MutableRefObject<
    FlatList<any>
  >;

  const {
    state: { documents },
  } = useContext(ImportContext);

  if (!documents || !documents.length) {
    return (
      <View style={styles.default}>
        <Text style={styles.defaultText}>
          Select files (.jpeg) or take new pictures...
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.flatList}
      numColumns={2}
      keyExtractor={(item, index) => item.uri || index.toString()}
      data={documents}
      ref={flatListRef}
      onContentSizeChange={() => flatListRef?.current?.scrollToEnd()}
      renderItem={({ item }) => (
        <View style={styles.container}>
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
  flatList: { marginBottom: 72 },
  default: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 100,
  },
  defaultText: {
    textAlign: 'center',
    color: MAIN_COLOR,
  },
  container: {
    flex: 1,
    margin: 6,
  },
  imageStyle: {
    height: 140,
    width: '100%',
    borderRadius: DEFAULT_BORDER,
  },
});

export default ImportDocumentGallery;
