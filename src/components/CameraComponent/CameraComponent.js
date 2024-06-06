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
import {Svg, Path} from 'react-native-svg';
import CameraIcon from '../../assets/flip-camera-ios.svg';

const CameraComponent = () => {
  const {height, width} = useWindowDimensions();
  const cameraRef = useRef(null);
  const [photo, setPhoto] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const {savedPhotos, setSavedPhotos} = useContext(PhotoContext);
  const navigation = useNavigation();
  const [cameraDirection, setCameraDirection] = useState(CameraType.Front);
  useEffect(() => {
    const requestPermissions = async () => {
      if (Platform.OS === 'android') {
        try {
          const cameraGranted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
              title: 'Camera Permission',
              message: 'This app needs camera access to take pictures',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );

          const storageGranted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
              title: 'External Storage Write Permission',
              message:
                'This app needs write access to your storage to save photos',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );

          if (cameraGranted !== PermissionsAndroid.RESULTS.GRANTED) {
            console.log('Camera permission denied');
          }
          if (storageGranted !== PermissionsAndroid.RESULTS.GRANTED) {
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

  const savePhoto = async () => {
    if (photo) {
      const directoryPath = `${RNFS.ExternalStorageDirectoryPath}/DCIM/Jovision`;
      const filePath = `${directoryPath}/photo_${Date.now()}.jpg`;
      try {
        if (!(await RNFS.exists(directoryPath))) {
          await RNFS.mkdir(directoryPath);
        }
        await RNFS.moveFile(photo, filePath);
        setSavedPhotos(prevPhotos => [...prevPhotos, filePath]);
        console.log('Photo saved to:', filePath);
      } catch (error) {
        console.error('Failed to save photo:', error);
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
      <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
        <Text style={styles.buttonText}>Capture</Text>
      </TouchableOpacity>
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
          <Text style={styles.modalText}>Do you want to save this photo?</Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.button, styles.buttonSave]}
              onPress={savePhoto}>
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
  flipCameraButton: {
    position: 'absolute',
    bottom: 30, // adjust this value as needed
    left: 50,
    alignSelf: 'center',
    // other styles...
    backgroundColor: 'white',
    borderRadius: 50,
    width: 70,
    height: 70,
  },
  captureButton: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    backgroundColor: 'white',
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
