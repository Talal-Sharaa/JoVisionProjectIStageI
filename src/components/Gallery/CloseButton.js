import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const CloseButton = ({ onClose }) => {
  return (
    <TouchableOpacity
      style={styles.closeButton}
      onPress={onClose}>
      <Text style={styles.closeButtonText}>Close</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default CloseButton;
