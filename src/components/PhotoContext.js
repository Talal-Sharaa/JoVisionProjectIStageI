import React, {createContext, useState} from 'react';
import RNFS from 'react-native-fs';

export const PhotoContext = createContext();

export const PhotoProvider = ({children}) => {
  const [savedPhotos, setSavedPhotos] = useState([]);
  const [isFullScreenVisible, setIsFullScreenVisible] = useState(false);
  const [currentMediaUri, setCurrentMediaUri] = useState(null);
  const [isVideo, setIsVideo] = useState(false);
  const [isRenameModalVisible, setRenameModalVisible] = useState(false);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isActionModalVisible, setActionModalVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0); // Add currentTime state

  const handleRename = (currentIndex, renameText) => {
    const updatedPhotos = [...savedPhotos];
    const oldPath = savedPhotos[currentIndex];
    const newPath = oldPath.replace(/[^/]*$/, renameText);

    RNFS.moveFile(oldPath, newPath)
      .then(() => {
        updatedPhotos[currentIndex] = newPath;
        setSavedPhotos(updatedPhotos);
      })
      .catch(error => {
        console.error('Failed to rename file', error);
      });

    setRenameModalVisible(false);
    setActionModalVisible(false);
  };

  const handleDelete = currentIndex => {
    const updatedPhotos = savedPhotos.filter(
      (_, index) => index !== currentIndex,
    );
    setSavedPhotos(updatedPhotos);
    setDeleteModalVisible(false);
    setActionModalVisible(false);
  };

  const handleOpenFullScreen = uri => {
    setCurrentIndex(savedPhotos.indexOf(uri));
    setIsVideo(uri.endsWith('.mov') || uri.endsWith('.mp4'));
    setCurrentMediaUri(uri);
    setIsFullScreenVisible(true);
  };

  const handleCloseFullScreen = () => {
    setIsFullScreenVisible(false);
    setCurrentMediaUri(null);
    setIsVideo(false);
  };

  const handleSkip = (playerRef, seconds) => {
    if (playerRef && playerRef.current) {
      const newTime = currentTime + seconds;
      playerRef.current.seek(newTime);
      console.log(`Skipped ${seconds} seconds to ${newTime}`);
      setCurrentTime(newTime); // Update the currentTime state
    }
  };

  const handleNext = () => {
    if (currentIndex < savedPhotos.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setCurrentMediaUri(savedPhotos[nextIndex]);
      setIsVideo(
        savedPhotos[nextIndex].endsWith('.mov') ||
          savedPhotos[nextIndex].endsWith('.mp4'),
      );
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      setCurrentMediaUri(savedPhotos[prevIndex]);
      setIsVideo(
        savedPhotos[prevIndex].endsWith('.mov') ||
          savedPhotos[prevIndex].endsWith('.mp4'),
      );
    }
  };

  return (
    <PhotoContext.Provider
      value={{
        savedPhotos,
        setSavedPhotos,
        onRenameFile: handleRename,
        onDeleteFile: handleDelete,
        onOpenFullScreen: handleOpenFullScreen,
        handleCloseFullScreen,
        handleSkip,
        handleNext,
        handlePrevious,
        isFullScreenVisible,
        currentMediaUri,
        isVideo,
        isRenameModalVisible,
        setRenameModalVisible,
        isDeleteModalVisible,
        setDeleteModalVisible,
        isActionModalVisible,
        setActionModalVisible,
        currentTime, // Pass currentTime state
        setCurrentTime, // Pass setCurrentTime state updater
      }}>
      {children}
    </PhotoContext.Provider>
  );
};
