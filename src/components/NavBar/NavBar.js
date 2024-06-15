import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {PhotoProvider} from '../PhotoContext';
import AppTabs from './AppTabs';

const NavBar = () => {
  return (
    <PhotoProvider>
      <NavigationContainer>
        <AppTabs />
      </NavigationContainer>
    </PhotoProvider>
  );
};

export default NavBar;
