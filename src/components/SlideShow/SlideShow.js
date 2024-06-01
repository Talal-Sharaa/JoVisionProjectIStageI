import React, {useContext, useState, useEffect} from 'react';
import {View, Button} from 'react-native';
import Swiper from 'react-native-swiper';
import styles from './SlideShow.styles';
import {PhotoContext} from '../PhotoContext';
import Image from 'react-native-image-progress';
import {useFocusEffect} from '@react-navigation/native';

const SlideShow = () => {
  const {savedPhotos} = useContext(PhotoContext);
  const [isPaused, setIsPaused] = useState(true);
  const images = savedPhotos.map(photo => ({uri: `file://${photo}`}));

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        setIsPaused(true);
      };
    }, []),
  );

  return (
    <View style={styles.container}>
      <Swiper
        style={styles.wrapper}
        showsButtons={false}
        autoplay={!isPaused}
        loop={true}
        scrollEnabled={false}
        autoplayTimeout={2.5}
        autoplayDirection={true}>
        {images.map((image, index) => (
          <View style={styles.slide} key={index}>
            <Image source={image} style={styles.image} />
          </View>
        ))}
      </Swiper>
      <Button
        title="⏯️"
        onPress={() => {
          setIsPaused(!isPaused);
        }}
      />
    </View>
  );
};

export default SlideShow;
