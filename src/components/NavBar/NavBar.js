import React from 'react';
import {useWindowDimensions} from 'react-native';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import CameraComponent from '../CameraComponent/CameraComponent';
import Sensors from '../Sensors/Sensors';
import Gallery from '../Gallery/Gallery';
import {PhotoProvider} from '../PhotoContext';
import SlideShow from '../SlideShow/SlideShow';
const Tab = createMaterialBottomTabNavigator();

const NavBar = () => {
  const {width, height} = useWindowDimensions();
  return (
    <PhotoProvider>
      <NavigationContainer>
        <Tab.Navigator style={{width, height}}>
          <Tab.Screen name="Camera" component={CameraComponent} />
          <Tab.Screen name="Sensors" component={Sensors} />
          <Tab.Screen name="Gallery" component={Gallery} />
          <Tab.Screen name="SlideShow" component={SlideShow} />
        </Tab.Navigator>
      </NavigationContainer>
    </PhotoProvider>
  );
};

export default NavBar;
