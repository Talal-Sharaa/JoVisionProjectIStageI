import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import GetLocation from 'react-native-get-location';
import {gyroscope} from 'react-native-sensors';
import {throttle} from 'lodash';

const Sensors = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [gyroscopeData, setGyroscopeData] = useState(null);
  useEffect(() => {
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

    const intervalId = setInterval(fetchLocation, 10000);

    return () => clearInterval(intervalId);
  }, []);

  const {latitude, longitude, altitude, speed} = location || {};
  useEffect(() => {
    const throttledLog = throttle(({x, y, z, timestamp}) => {
      setGyroscopeData({x, y, z, timestamp});
      console.log(
        Number(gyroscopeData.x).toFixed(5),
        Number(gyroscopeData.y).toFixed(5),
        Number(gyroscopeData.z).toFixed(5),
      );
    }, 500);
    const subscription = gyroscope.subscribe(throttledLog);
    return () => subscription.unsubscribe();
  }, []);
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Sensors Component</Text>
      <Text style={styles.text}>
        Location: {location ? `${latitude}, ${longitude}` : 'Fetching...'}
      </Text>
      <Text style={styles.text}>
        Altitude: {location ? altitude : 'Fetching...'}
      </Text>
      <Text style={styles.text}>Speed: {location ? speed : 'Fetching...'}</Text>
      <Text style={styles.text}>
        Orientation:{' '}
        {gyroscopeData
          ? `${Number(gyroscopeData.x).toFixed(5)}, ${Number(
              gyroscopeData.y,
            ).toFixed(5)}, ${Number(gyroscopeData.z).toFixed(5)}`
          : 'Fetching...'}
      </Text>
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
  },
  errorText: {
    color: 'yellow',
  },
});
