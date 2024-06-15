import React from 'react';
import {Modal, View, Text, TouchableOpacity, StyleSheet} from 'react-native';

const SaveMediaModal = ({visible, onRequestClose, onSaveMedia, isRecording}) => (
  <Modal
    animationType="slide"
    transparent
    visible={visible}
    onRequestClose={onRequestClose}>
    <View style={styles.modalView}>
      <Text style={styles.modalText}>
        Do you want to save this {isRecording ? 'video' : 'photo'}?
      </Text>
      <View style={styles.modalButtons}>
        <TouchableOpacity style={[styles.button, styles.buttonSave]} onPress={onSaveMedia}>
          <Text style={styles.textStyle}>Yes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.buttonClose]} onPress={onRequestClose}>
          <Text style={styles.textStyle}>No</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color: 'white',
    fontSize: 18,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonSave: {
    backgroundColor: '#2196F3',
  },
  buttonClose: {
    backgroundColor: '#f44336',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default SaveMediaModal;
