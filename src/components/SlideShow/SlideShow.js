import React, {useContext, useState} from 'react';
import {View, Button} from 'react-native';
import Swiper from 'react-native-swiper';
import styles from './SlideShow.styles';
import {PhotoContext} from '../PhotoContext';
import Image from 'react-native-image-progress';

const SlideShow = () => {
  const {savedPhotos} = useContext(PhotoContext);
  const [isPaused, setIsPaused] = useState(false);
  const images = savedPhotos.map(photo => ({uri: `file://${photo}`}));

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
