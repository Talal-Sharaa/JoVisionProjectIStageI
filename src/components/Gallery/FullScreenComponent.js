import React, {useContext, useRef} from 'react';
import {Modal, View, StyleSheet} from 'react-native';
import {PhotoContext} from '../PhotoContext';
import MediaContent from './MediaContent';
import ControlButtons from './ControlButtons';
import CloseButton from './CloseButton';

const FullScreenComponent = () => {
  const {
    isFullScreenVisible,
    currentMediaUri,
    isVideo,
    handleCloseFullScreen,
    handleSkip,
    handleNext,
    handlePrevious,
    currentTime, // Get currentTime from context
    setCurrentTime, // Get setCurrentTime from context
  } = useContext(PhotoContext);

  const videoRef = useRef(null);

  const onProgress = data => {
    setCurrentTime(data.currentTime);
  };

  if (!isFullScreenVisible || !currentMediaUri) {
    return null;
  }

  return (
    <Modal visible={isFullScreenVisible} transparent={false}>
      <View style={styles.fullScreenContainer}>
        <MediaContent
          uri={currentMediaUri}
          isVideo={isVideo}
          videoRef={videoRef}
          onProgress={onProgress}
        />
        <ControlButtons
          isVideo={isVideo}
          onSkip={seconds => handleSkip(videoRef, seconds)}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />
        <CloseButton onClose={handleCloseFullScreen} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FullScreenComponent;
