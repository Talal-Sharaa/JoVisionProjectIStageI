// GalleryComponent.js
import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import ImageView from 'react-native-image-viewing';
import {PhotoContext} from '../PhotoContext';
import {useFocusEffect} from '@react-navigation/native';

const GalleryComponent = () => {
  const {savedPhotos} = useContext(PhotoContext);
  const [visible, setIsVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = savedPhotos.map(photo => ({uri: `file://${photo}`}));

  const numColumns = 3;
  const {width} = Dimensions.get('window');
  const imageSize = (width - 40) / numColumns;

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        setIsVisible(false);
        setCurrentIndex(0);
      };
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gallery</Text>
      <FlatList
        data={savedPhotos}
        keyExtractor={item => item}
        renderItem={({item, index}) => (
          <TouchableOpacity
            onPress={() => {
              setCurrentIndex(index);
              setIsVisible(true);
            }}>
            <Image
              source={{uri: `file://${item}`}}
              style={[styles.image, {width: imageSize, height: imageSize}]}
            />
          </TouchableOpacity>
        )}
        numColumns={numColumns}
        columnWrapperStyle={styles.columnWrapper}
      />
      <ImageView
        images={images}
        imageIndex={currentIndex}
        visible={visible}
        onRequestClose={() => setIsVisible(false)}
      />
    </View>
  );
};

export default GalleryComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  image: {
    margin: 5,
    resizeMode: 'cover',
  },
});
