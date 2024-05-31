// PhotoContext.js
import React, {createContext, useState} from 'react';

export const PhotoContext = createContext();

export const PhotoProvider = ({children}) => {
  const [savedPhotos, setSavedPhotos] = useState([]);

  return (
    <PhotoContext.Provider value={{savedPhotos, setSavedPhotos}}>
      {children}
    </PhotoContext.Provider>
  );
};
