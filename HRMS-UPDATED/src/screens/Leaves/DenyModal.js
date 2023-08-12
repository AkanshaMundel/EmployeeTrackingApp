import React, {useState} from 'react';
import {
  View,
  TextInput,
  Modal,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';

const DenyModal = ({isVisible, onRequestClose, onDeny, onCancel}) => {
  const [denyReason, setDenyReason] = useState('');

  const handleDenyPress = () => {
    onDeny(denyReason);
    setDenyReason('');
  };

  return (
    <Modal visible={isVisible} onRequestClose={onRequestClose} transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TextInput
            style={styles.textInput}
            placeholder="Enter Deny Reason"
            value={denyReason}
            onChangeText={setDenyReason}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.denyButton}
              onPress={handleDenyPress}
            >
              <Text style={styles.denyButtonText}>Deny</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 8,
    width: '60%',
  },
  textInput: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    paddingVertical: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    backgroundColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  denyButton: {
    backgroundColor: '#283093',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  denyButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default DenyModal;