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
  TextInput,
  RefreshControl,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import ImageView from 'react-native-image-viewing';
import Video from 'react-native-video';
import {PhotoContext} from '../PhotoContext';
import {useFocusEffect} from '@react-navigation/native';
import {createThumbnail} from 'react-native-create-thumbnail';
import PlayButton from '../../assets/play-button.svg';
import RNFS from 'react-native-fs';

const GalleryComponent = ({navigation}) => {
  const {savedPhotos, setSavedPhotos} = useContext(PhotoContext);
  const [visible, setIsVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVideo, setIsVideo] = useState(false);
  const [thumbnails, setThumbnails] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [renameModalVisible, setRenameModalVisible] = useState(false);
  const [renameText, setRenameText] = useState('');
  const [actionModalVisible, setActionModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  useEffect(() => {
    const requestStoragePermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('You can use the storage');
        } else {
          console.log('storage permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    };

    requestStoragePermission();
  }, []);

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

  const handleRename = () => {
    const updatedPhotos = [...savedPhotos];
    const index = currentIndex;
    const oldPath = savedPhotos[index];
    const newPath = oldPath.replace(/[^/]*$/, renameText);

    // Rename the file on the device using react-native-fs
    RNFS.moveFile(oldPath, newPath)
      .then(() => {
        updatedPhotos[index] = newPath;
        setSavedPhotos(updatedPhotos);
      })
      .catch(error => {
        console.error('Failed to rename file', error);
      });

    setRenameModalVisible(false);
    setActionModalVisible(false);
  };

  const handleDelete = () => {
    const updatedPhotos = savedPhotos.filter(
      (_, index) => index !== currentIndex,
    );
    setSavedPhotos(updatedPhotos);
    setIsVisible(false);
    setDeleteModalVisible(false);
    setActionModalVisible(false);
  };

  const handlePressMedia = (item, index) => {
    setCurrentIndex(index);
    setActionModalVisible(true);
  };

  const onRefresh = () => {
    setRefreshing(true);
    // Reload the savedPhotos, if necessary
    setRefreshing(false);
  };

  const renderMedia = (item, index) => {
    if (item.endsWith('.mov')) {
      return (
        <TouchableOpacity
          key={item}
          onPress={() => handlePressMedia(item, index)}>
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
          onPress={() => handlePressMedia(item, index)}>
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
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
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
      <Modal
        visible={renameModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setRenameModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Rename</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter new name"
              value={renameText}
              onChangeText={setRenameText}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => setRenameModalVisible(false)}
                style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleRename}
                style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        visible={actionModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setActionModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Action</Text>
            <TouchableOpacity
              onPress={() => {
                setRenameText('');
                setRenameModalVisible(true);
              }}
              style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Rename</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setDeleteModalVisible(true)}
              style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setActionModalVisible(false);
              }}
              style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        visible={deleteModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setDeleteModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Delete</Text>
            <Text style={styles.modalText}>
              Are you sure you want to delete this file?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => setDeleteModalVisible(false)}
                style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleDelete}
                style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  image: {
    margin: 5,
    borderRadius: 5,
  },
  playButtonContainer: {
    position: 'absolute',
  },
  videoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    padding: 10,
  },
  modalButtonText: {
    fontSize: 18,
    color: '#007BFF',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  videoPlaceholder: {
    color: '#fff',
    textAlign: 'center',
  },
});

export default GalleryComponent;
