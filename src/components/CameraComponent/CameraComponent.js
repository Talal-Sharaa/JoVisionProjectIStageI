import React, {useRef, useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
  useWindowDimensions,
  Modal,
} from 'react-native';
import {Camera, CameraType} from 'react-native-camera-kit';
import RNFS from 'react-native-fs';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {PhotoContext} from '../PhotoContext';
import CameraIcon from '../../assets/flip-camera-ios.svg';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';

const CameraComponent = () => {
  const {height, width} = useWindowDimensions();
  const cameraRef = useRef(null);
  const [photo, setPhoto] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const {savedPhotos, setSavedPhotos} = useContext(PhotoContext);
  const navigation = useNavigation();
  const [cameraDirection, setCameraDirection] = useState(CameraType.Front);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    const requestPermissions = async () => {
      if (Platform.OS === 'android') {
        try {
          const cameraGranted = await request(PERMISSIONS.ANDROID.CAMERA);
          const audioGranted = await request(PERMISSIONS.ANDROID.RECORD_AUDIO);
          const storageGranted = await request(
            PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
          );

          if (cameraGranted !== RESULTS.GRANTED) {
            console.log('Camera permission denied');
          }
          if (audioGranted !== RESULTS.GRANTED) {
            console.log('Audio permission denied');
          }
          if (storageGranted !== RESULTS.GRANTED) {
            console.log('External storage write permission denied');
          }
        } catch (err) {
          console.warn(err);
        }
      }
    };

    requestPermissions();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        setPhoto(null);
        setModalVisible(false);
      };
    }, []),
  );

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const image = await cameraRef.current.capture();
        setPhoto(image.uri);
        setModalVisible(true);
      } catch (error) {
        console.error('Failed to take picture:', error);
      }
    }
  };

  const startRecording = async () => {
    if (cameraRef.current && cameraRef.current.startRecording && !isRecording) {
      try {
        setIsRecording(true);
        const video = await cameraRef.current.startRecording({
          maxDuration: 60, // Set max duration if needed
          flashMode: 'off',
        });
        console.log('Recording started');
        setPhoto(video.uri); // Save the video URI in the photo state for modal handling
        setModalVisible(true);
      } catch (error) {
        console.error('Failed to start recording:', error);
        setIsRecording(false);
      }
    }
  };

  const stopRecording = async () => {
    if (cameraRef.current && isRecording) {
      try {
        await cameraRef.current.stopRecording();
        console.log('Recording stopped');
        setIsRecording(false);
      } catch (error) {
        console.error('Failed to stop recording:', error);
      }
    }
  };

  const saveMedia = async () => {
    if (photo) {
      const directoryPath = `${RNFS.ExternalStorageDirectoryPath}/DCIM/Jovision`;
      const filePath = `${directoryPath}/media_${Date.now()}.${
        isRecording ? 'mp4' : 'jpg'
      }`;
      try {
        if (!(await RNFS.exists(directoryPath))) {
          await RNFS.mkdir(directoryPath);
        }
        await RNFS.moveFile(photo, filePath);
        setSavedPhotos(prevPhotos => [...prevPhotos, filePath]);
        console.log('Media saved to:', filePath);
      } catch (error) {
        console.error('Failed to save media:', error);
      }
      setModalVisible(false);
    }
  };

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        cameraType={cameraDirection}
        flashMode="auto"
        style={{height, width}}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
          <Text style={styles.buttonText}>Capture</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.recordButton,
            {backgroundColor: isRecording ? 'red' : 'white'},
          ]}
          onPress={isRecording ? stopRecording : startRecording}>
          <Text style={styles.buttonText}>
            {isRecording ? 'Stop' : 'Record'}
          </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.flipCameraButton}
        onPress={() =>
          setCameraDirection(
            cameraDirection === CameraType.Front
              ? CameraType.Back
              : CameraType.Front,
          )
        }>
        <View
          style={{
            position: 'absolute',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
          }}>
          <CameraIcon width="70" height="50" />
        </View>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>
            Do you want to save this {isRecording ? 'video' : 'photo'}?
          </Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.button, styles.buttonSave]}
              onPress={saveMedia}>
              <Text style={styles.textStyle}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.textStyle}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  buttonContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
  },
  flipCameraButton: {
    position: 'absolute',
    bottom: 30, // adjust this value as needed
    left: 50,
    alignSelf: 'center',
    backgroundColor: 'white',
    borderRadius: 50,
    width: 70,
    height: 70,
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
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color: 'white',
    fontSize: 18,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonSave: {
    backgroundColor: '#2196F3',
  },
  buttonClose: {
    backgroundColor: '#f44336',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
