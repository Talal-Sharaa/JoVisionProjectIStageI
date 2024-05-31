import React from 'react';
import {View, Text, StyleSheet, useWindowDimensions} from 'react-native';
import styles from './NavBar.styles';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
const Tab = createMaterialBottomTabNavigator();
import CameraComponent from '../CameraComponent/CameraComponent';
import Sensors from '../Sensors/Sensors';
import {NavigationContainer} from '@react-navigation/native';
const NavBar = () => {
  const {width, height} = useWindowDimensions();
  return (
    <NavigationContainer>
      <Tab.Navigator style={{width: width, height: height}}>
        <Tab.Screen name="Camera" component={CameraComponent} />
        <Tab.Screen name="Sensors" component={Sensors} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};
export default NavBar;