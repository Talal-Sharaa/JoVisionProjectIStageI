import React from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
} from 'react-native';
import PlayButton from '../../assets/play-button.svg';

const GalleryGrid = ({savedPhotos, handleActionPress}) => {
  const renderItem = ({item, index}) => {
    const isVideo = item.endsWith('.mov');
    const thumbnailUri = `file://${item}`;
    return (
      <View style={styles.itemContainer}>
        <TouchableOpacity onPress={() => handleActionPress(index)}>
          <View style={styles.imageContainer}>
            <Image
              source={{uri: thumbnailUri}}
              style={styles.image}
              onError={e =>
                console.error(`Failed to load image: ${e.nativeEvent.error}`)
              }
            />
            {isVideo && (
              <View style={styles.playButtonOverlay}>
                <PlayButton width="50" height="50" />
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <FlatList
      data={savedPhotos}
      renderItem={renderItem}
      keyExtractor={item => item}
    />
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    marginBottom: 20,
  },
  imageContainer: {
    position: 'relative',
    width: 100,
    height: 100,
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e1e4e8',
  },
  playButtonOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{translateX: -25}, {translateY: -25}],
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default GalleryGrid;
