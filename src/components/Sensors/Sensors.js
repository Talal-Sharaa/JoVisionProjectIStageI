import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import GetLocation from 'react-native-get-location';
import {
  accelerometer,
  setUpdateIntervalForType,
  SensorTypes,
} from 'react-native-sensors';
import {throttle} from 'lodash';
import {useFocusEffect} from '@react-navigation/native';
import ManWalking from '../../assets/man-walking.svg';
import ManSitting from '../../assets/man-sitting.svg';
import CarSide from '../../assets/car-side.svg';
import FlatPlatform from '../../assets/flat-platform.svg';
import Portrait from '../../assets/camera-portrait.svg';
import LandscapeLeft from '../../assets/photography-landscape-mode-left.svg';
import LandscapeRight from '../../assets/photography-landscape-mode-right.svg';
import UpsideDown from '../../assets/inverted-yoga-posture.svg';
const Sensors = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [accelerometerData, setAccelerometerData] = useState(null);
  const [orientation, setOrientation] = useState('Unknown');

  useFocusEffect(
    React.useCallback(() => {
      const fetchLocation = () => {
        GetLocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 60000,
        })
          .then(location => {
            console.log(location);
            setLocation(location);
            setError(null); // Clear previous errors if successful
          })
          .catch(error => {
            const {code, message} = error;
            console.warn(code, message);
            setError(message);
          });
      };

      fetchLocation();

      const intervalId = setInterval(fetchLocation, 6000);

      const throttledLog = throttle(({x, y, z, timestamp}) => {
        setAccelerometerData({x, y, z, timestamp});

        // Determine orientation
        const threshold = 7; // Adjust this threshold based on your needs
        if (y > threshold) {
          setOrientation('Portrait');
        } else if (y < -1 * threshold) {
          setOrientation('Upside Down');
        } else if (x > threshold) {
          setOrientation('Left Landscape');
        } else if (x < -1 * threshold) {
          setOrientation('Right Landscape');
        } else {
          setOrientation('Flat');
        }

        console.log(
          Number(x).toFixed(5),
          Number(y).toFixed(5),
          Number(z).toFixed(5),
        );
      }, 500);

      setUpdateIntervalForType(SensorTypes.accelerometer, 500); // Update interval to 500ms

      const subscription = accelerometer.subscribe(throttledLog);

      return () => {
        clearInterval(intervalId);
        subscription.unsubscribe();
        setLocation(null);
        setAccelerometerData(null);
        setError(null);
      };
    }, []),
  );

  const {latitude, longitude, altitude, speed} = location || {};
  let displayText = '0 km/h';
  const speedKmh = (speed * 3.6).toFixed(2);
  displayText = `${speedKmh} km/h`;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Sensors Component</Text>
      <Text style={styles.text}>
        Location: {location ? `${latitude}, ${longitude}` : 'Fetching...'}
      </Text>
      <Text style={styles.text}>
        Altitude: {location ? altitude : 'Fetching...'}
      </Text>
      <Text style={styles.text}>
        Speed: {location ? displayText : 'Fetching...'}
      </Text>
      {speedKmh >= 0 && speedKmh <= 1 && (
        <View style={styles.iconContainer}>
          <ManSitting width={50} height={50} style={styles.icon} />
        </View>
      )}
      {speedKmh > 1 && speedKmh < 20 && (
        <View style={styles.iconContainer}>
          <ManWalking width={50} height={50} style={styles.icon} />
        </View>
      )}
      {speedKmh >= 20 && (
        <View style={styles.iconContainer}>
          <CarSide width={50} height={50} style={styles.icon} />
        </View>
      )}
      <Text style={styles.text}>
        Accelerometer Data:{' '}
        {accelerometerData
          ? `${Number(accelerometerData.x).toFixed(5)}, ${Number(
              accelerometerData.y,
            ).toFixed(5)}, ${Number(accelerometerData.z).toFixed(5)}`
          : 'Fetching...'}
      </Text>
      <Text style={styles.text}>Orientation: {orientation}</Text>
      {orientation == 'Portrait' && (
        <View style={styles.iconContainer}>
          <Portrait width={50} height={50} style={styles.icon} />
        </View>
      )}
      {orientation == 'Upside Down' && (
        <View style={styles.iconContainer}>
          <UpsideDown width={50} height={50} style={styles.icon} />
        </View>
      )}
      {orientation == 'Left Landscape' && (
        <View style={styles.iconContainer}>
          <LandscapeLeft width={50} height={50} style={styles.icon} />
        </View>
      )}
      {orientation == 'Right Landscape' && (
        <View style={styles.iconContainer}>
          <LandscapeRight width={50} height={50} style={styles.icon} />
        </View>
      )}
      {orientation == 'Flat' && (
        <View style={styles.iconContainer}>
          <FlatPlatform width={50} height={50} style={styles.icon} />
        </View>
      )}
      {error && <Text style={styles.errorText}>Error: {error}</Text>}
    </View>
  );
};

export default Sensors;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  text: {
    color: 'red',
    fontSize: 18,
    margin: 5,
  },
  errorText: {
    color: 'yellow',
    fontSize: 16,
    marginTop: 10,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  icon: {
    width: 50,
    height: 50,
    marginTop: 10,
  },
});
