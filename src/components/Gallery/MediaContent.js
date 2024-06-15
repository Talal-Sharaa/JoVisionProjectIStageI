import React from 'react';
import {Image, StyleSheet} from 'react-native';
import Video from 'react-native-video';

const MediaContent = ({uri, isVideo, videoRef, onProgress}) => {
  if (isVideo) {
    return (
      <Video
        ref={videoRef}
        source={{uri}}
        style={styles.fullScreenMedia}
        controls
        onProgress={onProgress}
      />
    );
  }

  return <Image source={{uri}} style={styles.fullScreenMedia} />;
};

const styles = StyleSheet.create({
  fullScreenMedia: {
    width: '100%',
    height: '80%',
    resizeMode: 'contain',
  },
});

export default MediaContent;
