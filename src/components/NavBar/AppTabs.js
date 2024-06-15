import React from 'react';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {useWindowDimensions} from 'react-native';
import CameraComponent from '../CameraComponent/CameraComponent';
import Sensors from '../Sensors/Sensors';
import GalleryComponent from '../Gallery/Gallery';
import SlideShow from '../SlideShow/SlideShow';

const Tab = createMaterialBottomTabNavigator();

const AppTabs = () => {
  const {width, height} = useWindowDimensions();
  return (
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
        component={GalleryComponent}
        options={{unmountOnBlur: true}}
      />
      <Tab.Screen
        name="SlideShow"
        component={SlideShow}
        options={{unmountOnBlur: true}}
      />
    </Tab.Navigator>
  );
};

export default AppTabs;
