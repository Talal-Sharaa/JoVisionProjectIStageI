import React from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

export const RenameModal = ({
  visible,
  renameText,
  setRenameText,
  onCancel,
  onSave,
}) => (
  <Modal
    visible={visible}
    transparent={true}
    animationType="slide"
    onRequestClose={onCancel}>
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Rename</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Enter new name"
          value={renameText}
          onChangeText={setRenameText}
        />
        <View style={styles.modalButtons}>
          <TouchableOpacity onPress={onCancel} style={styles.modalButton}>
            <Text style={styles.modalButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onSave} style={styles.modalButton}>
            <Text style={styles.modalButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

export const ActionModal = ({
  visible,
  onRename,
  onDelete,
  onOpenFullScreen,
  onCancel,
}) => (
  <Modal
    visible={visible}
    transparent={true}
    animationType="slide"
    onRequestClose={onCancel}>
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Select Action</Text>
        <TouchableOpacity onPress={onRename} style={styles.modalButton}>
          <Text style={styles.modalButtonText}>Rename</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete} style={styles.modalButton}>
          <Text style={styles.modalButtonText}>Delete</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onOpenFullScreen} style={styles.modalButton}>
          <Text style={styles.modalButtonText}>Open Full Screen</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onCancel} style={styles.modalButton}>
          <Text style={styles.modalButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

export const DeleteModal = ({visible, onConfirm, onCancel}) => (
  <Modal
    visible={visible}
    transparent={true}
    animationType="slide"
    onRequestClose={onCancel}>
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Confirm Delete</Text>
        <Text style={styles.modalText}>
          Are you sure you want to delete this file?
        </Text>
        <View style={styles.modalButtons}>
          <TouchableOpacity onPress={onCancel} style={styles.modalButton}>
            <Text style={styles.modalButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onConfirm} style={styles.modalButton}>
            <Text style={styles.modalButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  modalButton: {
    padding: 10,
  },
  modalButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
});
