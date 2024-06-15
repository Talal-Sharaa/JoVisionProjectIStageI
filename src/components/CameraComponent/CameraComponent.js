// CameraComponent.js
import React, {useRef, useState, useContext, useCallback} from 'react';
import {View, Text, StyleSheet, useWindowDimensions} from 'react-native';
import {Camera, useCameraDevice} from 'react-native-vision-camera';
import RNFS from 'react-native-fs';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {PhotoContext} from '../PhotoContext';
import usePermissions from './hooks/usePermissions';
import CameraControls from './CameraControls';
import SaveMediaModal from './SaveMediaModal';

const CameraComponent = () => {
  const {height, width} = useWindowDimensions();
  const camera = useRef(null);
  const [photo, setPhoto] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const {savedPhotos, setSavedPhotos} = useContext(PhotoContext);
  const [isRecording, setIsRecording] = useState(false);
  const [isBackCamera, setIsBackCamera] = useState(true);
  const device = useCameraDevice(isBackCamera ? 'back' : 'front');

  usePermissions();

  useFocusEffect(
    useCallback(() => {
      return () => {
        setPhoto(null);
        setModalVisible(false);
      };
    }, []),
  );

  const takePicture = async () => {
    if (camera.current) {
      try {
        const photo = await camera.current.takePhoto();
        console.log('Photo taken:', photo);
        setPhoto(photo.path);
        setModalVisible(true);
      } catch (error) {
        console.error('Failed to take picture:', error);
      }
    }
  };

  const startRecording = async () => {
    if (camera.current && !isRecording) {
      try {
        setIsRecording(true);
        await camera.current.startRecording({
          maxDuration: 60,
          flashMode: 'off',
          onRecordingFinished: video => {
            console.log('Recording finished:', video);
            setPhoto(video.path);
            setModalVisible(true);
          },
          onRecordingError: error => {
            console.error('Recording error:', error);
            setIsRecording(false);
          },
        });
        console.log('Recording started');
      } catch (error) {
        console.error('Failed to start recording:', error);
        setIsRecording(false);
      }
    }
  };

  const stopRecording = async () => {
    if (camera.current && isRecording) {
      try {
        await camera.current.stopRecording();
        console.log('Recording stopped');
      } catch (error) {
        console.error('Failed to stop recording:', error);
      }
    }
  };

  const saveMedia = async () => {
    console.log('Attempting to save media:', photo);
    if (photo) {
      const directoryPath = `${RNFS.ExternalStorageDirectoryPath}/DCIM/Jovision`;
      const filePath = `${directoryPath}/media_${Date.now()}.${
        isRecording ? 'mov' : 'jpg'
      }`;

      try {
        if (!(await RNFS.exists(directoryPath))) {
          await RNFS.mkdir(directoryPath);
        }

        // Move the media file and confirm it's been moved
        await RNFS.moveFile(photo, filePath);

        // Ensure the file exists
        const fileExists = await RNFS.exists(filePath);
        if (fileExists) {
          console.log('Media saved to:', filePath);

          // Update the savedPhotos context
          setSavedPhotos(prevPhotos => [...prevPhotos, `file://${filePath}`]);

          // Reset states after saving
          setPhoto(null);
          setModalVisible(false);
          setIsRecording(false);
        } else {
          console.error('File does not exist after moving:', filePath);
        }
      } catch (error) {
        console.error('Failed to save media:', error);
      }
    } else {
      console.warn('No photo to save');
    }
  };

  const flipCamera = () => {
    setIsBackCamera(!isBackCamera);
  };

  if (!device) {
    return (
      <View style={styles.container}>
        <Text>Loading camera...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        device={device}
        ref={camera}
        flashMode="auto"
        style={{height, width}}
        photo
        video
        audio
        isActive
      />
      <CameraControls
        isRecording={isRecording}
        onTakePicture={takePicture}
        onStartRecording={startRecording}
        onStopRecording={stopRecording}
        onFlipCamera={flipCamera}
      />
      <SaveMediaModal
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
        onSaveMedia={saveMedia}
        isRecording={isRecording}
      />
    </View>
  );
};

export default CameraComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
