import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';

const ControlButtons = ({isVideo, onSkip, onNext, onPrevious}) => {
  return (
    <View style={styles.controlContainer}>
      {isVideo && (
        <>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => onSkip(-5)}>
            <Text style={styles.controlButtonText}>Rewind 5s</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => onSkip(5)}>
            <Text style={styles.controlButtonText}>Skip 5s</Text>
          </TouchableOpacity>
        </>
      )}
      <TouchableOpacity style={styles.controlButton} onPress={onPrevious}>
        <Text style={styles.controlButtonText}>Previous</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.controlButton} onPress={onNext}>
        <Text style={styles.controlButtonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  controlContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 10,
  },
  controlButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 5,
  },
  controlButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default ControlButtons;
