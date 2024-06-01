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
          <Tab.Screen
            name="Camera"
            component={CameraComponent}
            options={{unmountOnBlur: true}}
          />
          <Tab.Screen
            name="Sensors"
            component={Sensors}
            options={{unmountOnBlur: true}}
          />
          <Tab.Screen
            name="Gallery"
            component={Gallery}
            options={{unmountOnBlur: true}}
          />
          <Tab.Screen
            name="SlideShow"
            component={SlideShow}
            options={{unmountOnBlur: true}}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </PhotoProvider>
  );
};

export default NavBar;
