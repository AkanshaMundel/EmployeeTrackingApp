import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import PendingComponent from './PendingComponent';
import ConfirmedComponent from './ConfirmedComponent';
import RejectedComponent from './RejectedComponent';

const ApproveLeave = () => {
  const [selection, setSelection] = useState('pending');

  const handlePendingPress = () => {
    setSelection('pending');
  };

  const handleConfirmedPress = () => {
    setSelection('confirmed');
  };

  const handleRejectedPress = () => {
    setSelection('rejected');
  };

  return (
    <View>
      <Text style={styles.title}>Approve Leaves and Gatepass</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            selection === 'pending' && styles.activeButton,
          ]}
          onPress={handlePendingPress}
        >
          <Text
            style={[
              styles.buttonText,
              selection === 'pending' && styles.activeButtonText,
            ]}
          >
            Pending
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            selection === 'confirmed' && styles.activeButton,
          ]}
          onPress={handleConfirmedPress}
        >
          <Text
            style={[
              styles.buttonText,
              selection === 'confirmed' && styles.activeButtonText,
            ]}
          >
            Confirmed
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            selection === 'rejected' && styles.activeButton,
          ]}
          onPress={handleRejectedPress}
        >
          <Text
            style={[
              styles.buttonText,
              selection === 'rejected' && styles.activeButtonText,
            ]}
          >
            Rejected
          </Text>
        </TouchableOpacity>
      </View>

      {selection === 'pending' && <PendingComponent />}
      {selection === 'confirmed' && <ConfirmedComponent />}
      {selection === 'rejected' && <RejectedComponent />}
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#000000',
    marginLeft: '5%',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginLeft: '10%',
    marginRight: '10%',
    marginTop: 20,
    justifyContent: 'flex-start',
  },
  button: {
    flex: 1,
    borderWidth: 0.4,
    borderColor: '#CCCCCC',
    padding: 10,
    borderRadius: 1,
    // shadowOpacity: 0.2,
    // shadowRadius: 0.3,
    elevation: 1,
    backgroundColor: '#FBFBFC',
    // backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    // color: '#FFFFFF',
  },
  activeButton: {
    backgroundColor: '#FFFFFF',
  },
  buttonText: {
    // color: '#757575',

    fontWeight: '500',
    fontSize: 14,
  },
  activeButtonText: {
    color: '#000000',
  },
});

export default ApproveLeave;
