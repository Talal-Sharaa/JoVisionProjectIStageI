import React, {useContext, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {PhotoContext} from '../PhotoContext';
import {RenameModal, DeleteModal, ActionModal} from './Modals';
import FullScreenComponent from './FullScreenComponent';
import GalleryGrid from './GalleryGrid';

const GalleryComponent = () => {
  const {savedPhotos, onRenameFile, onDeleteFile, onOpenFullScreen} =
    useContext(PhotoContext);

  const [isRenameModalVisible, setRenameModalVisible] = useState(false);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isActionModalVisible, setActionModalVisible] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(null);
  const [renameText, setRenameText] = useState('');

  const handleRenamePress = index => {
    setCurrentMediaIndex(index);
    setRenameModalVisible(true);
  };

  const handleDeletePress = index => {
    setCurrentMediaIndex(index);
    setDeleteModalVisible(true);
  };

  const handleActionPress = index => {
    setCurrentMediaIndex(index);
    setActionModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <GalleryGrid
        savedPhotos={savedPhotos}
        handleActionPress={handleActionPress}
      />
      {isRenameModalVisible && (
        <RenameModal
          visible={isRenameModalVisible}
          renameText={renameText}
          setRenameText={setRenameText}
          onCancel={() => setRenameModalVisible(false)}
          onSave={() => {
            if (currentMediaIndex !== null) {
              onRenameFile(currentMediaIndex, renameText);
              setRenameModalVisible(false);
            }
          }}
        />
      )}
      {isDeleteModalVisible && (
        <DeleteModal
          visible={isDeleteModalVisible}
          onConfirm={() => {
            if (currentMediaIndex !== null) {
              onDeleteFile(currentMediaIndex);
              setDeleteModalVisible(false);
            }
          }}
          onCancel={() => setDeleteModalVisible(false)}
        />
      )}
      {isActionModalVisible && (
        <ActionModal
          visible={isActionModalVisible}
          onRename={() => {
            setActionModalVisible(false);
            handleRenamePress(currentMediaIndex);
          }}
          onDelete={() => {
            setActionModalVisible(false);
            handleDeletePress(currentMediaIndex);
          }}
          onOpenFullScreen={() => {
            onOpenFullScreen(savedPhotos[currentMediaIndex]);
            setActionModalVisible(false);
          }}
          onCancel={() => setActionModalVisible(false)}
        />
      )}
      <FullScreenComponent />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
});

export default GalleryComponent;
