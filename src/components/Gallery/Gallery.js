import React, {useContext, useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  Modal,
} from 'react-native';
import ImageView from 'react-native-image-viewing';
import Video from 'react-native-video';
import {PhotoContext} from '../PhotoContext';
import {useFocusEffect} from '@react-navigation/native';
import {createThumbnail} from 'react-native-create-thumbnail';
import PlayButton from '../../assets/play-button.svg';

const GalleryComponent = () => {
  const {savedPhotos} = useContext(PhotoContext);
  const [visible, setIsVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVideo, setIsVideo] = useState(false);
  const [thumbnails, setThumbnails] = useState({});

  useEffect(() => {
    const loadThumbnails = async () => {
      const newThumbnails = {};
      for (const video of savedPhotos.filter(photo => photo.endsWith('.mov'))) {
        const {path} = await createThumbnail({
          url: `file://${video}`,
          timeStamp: 1,
        });
        newThumbnails[video] = path;
      }
      setThumbnails(newThumbnails);
    };

    loadThumbnails();
  }, [savedPhotos]);

  const images = savedPhotos
    .filter(photo => !photo.endsWith('.mov'))
    .map(photo => ({uri: `file://${photo}`}));

  const numColumns = 3;
  const {width} = Dimensions.get('window');
  const imageSize = (width - 40) / numColumns;

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        setIsVisible(false);
        setCurrentIndex(0);
        setIsVideo(false);
      };
    }, []),
  );

  const renderMedia = (item, index) => {
    if (item.endsWith('.mov')) {
      return (
        <TouchableOpacity
          key={item}
          onPress={() => {
            setCurrentIndex(index);
            setIsVideo(true);
            setIsVisible(true);
          }}>
          <View
            style={[
              styles.image,
              {
                width: imageSize,
                height: imageSize,
                justifyContent: 'center',
                alignItems: 'center',
              },
            ]}>
            {thumbnails[item] ? (
              <>
                <Image
                  source={{uri: thumbnails[item]}}
                  style={[styles.image, {width: imageSize, height: imageSize}]}
                />
                <View style={styles.playButtonContainer}>
                  <PlayButton width="50" height="50" />
                </View>
              </>
            ) : (
              <Text style={styles.videoPlaceholder}>Loading...</Text>
            )}
          </View>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          key={item}
          onPress={() => {
            setCurrentIndex(
              images.findIndex(img => img.uri === `file://${item}`),
            );
            setIsVideo(false);
            setIsVisible(true);
          }}>
          <Image
            source={{uri: `file://${item}`}}
            style={[styles.image, {width: imageSize, height: imageSize}]}
          />
        </TouchableOpacity>
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gallery</Text>
      <FlatList
        data={savedPhotos}
        keyExtractor={item => item}
        renderItem={({item, index}) => renderMedia(item, index)}
        numColumns={numColumns}
        columnWrapperStyle={styles.columnWrapper}
      />
      <ImageView
        images={images}
        imageIndex={currentIndex}
        visible={visible && !isVideo}
        onRequestClose={() => setIsVisible(false)}
      />
      {isVideo && (
        <Modal
          visible={visible}
          transparent={true}
          onRequestClose={() => setIsVisible(false)}>
          <View style={styles.videoContainer}>
            <Video
              source={{uri: `file://${savedPhotos[currentIndex]}`}}
              style={styles.video}
              controls={true}
              resizeMode="contain"
            />
          </View>
        </Modal>
      )}
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
  videoPlaceholder: {
    fontSize: 16,
    color: 'white',
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5,
  },
  videoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.9)',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  playButtonContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
