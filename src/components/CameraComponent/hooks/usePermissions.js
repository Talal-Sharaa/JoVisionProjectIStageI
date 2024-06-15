import {useEffect} from 'react';
import {Platform} from 'react-native';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';

const usePermissions = () => {
  useEffect(() => {
    const requestPermissions = async () => {
      if (Platform.OS === 'android') {
        try {
          const cameraGranted = await request(PERMISSIONS.ANDROID.CAMERA);
          const audioGranted = await request(PERMISSIONS.ANDROID.RECORD_AUDIO);
          const storageGranted = await request(
            PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
          );

          if (
            cameraGranted !== RESULTS.GRANTED ||
            audioGranted !== RESULTS.GRANTED ||
            storageGranted !== RESULTS.GRANTED
          ) {
            console.log('One or more permissions denied');
          }
        } catch (err) {
          console.warn(err);
        }
      }
    };

    requestPermissions();
  }, []);
};

export default usePermissions;
