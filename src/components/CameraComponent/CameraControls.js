// CameraControls.js
import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';

const CameraControls = ({
  isRecording,
  onTakePicture,
  onStartRecording,
  onStopRecording,
  onFlipCamera,
}) => (
  <View style={styles.buttonContainer}>
    <TouchableOpacity style={styles.captureButton} onPress={onTakePicture}>
      <Text style={styles.buttonText}>Capture</Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={[
        styles.recordButton,
        {backgroundColor: isRecording ? 'red' : 'white'},
      ]}
      onPress={isRecording ? onStopRecording : onStartRecording}>
      <Text style={styles.buttonText}>{isRecording ? 'Stop' : 'Record'}</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.flipCameraButton} onPress={onFlipCamera}>
      <Text style={styles.buttonText}>Flip</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
  },
  flipCameraButton: {
    marginHorizontal: 20,
    backgroundColor: 'white',
    borderRadius: 50,
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    marginHorizontal: 20,
    backgroundColor: 'white',
    borderRadius: 50,
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordButton: {
    marginHorizontal: 20,
    borderRadius: 50,
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 14,
    color: 'black',
  },
});

export default CameraControls;
