import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import axios from 'axios';
import moment from 'moment';
import {BASE_URL} from '../../ConfigLinks';
import Feather from 'react-native-vector-icons/Feather';
import {showMessage, hideMessage} from 'react-native-flash-message';
import DenyModal from './DenyModal';

const PendingComponent = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [denyReason, setDenyReason] = useState('');
  const [isDenyModalVisible, setIsDenyModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetchDataFromAPI();
  }, [leaveRequests]);

  const fetchDataFromAPI = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/leave/pending`);
      const data = response.data;
      //console.log('datapending', data);

      if (data.success && data.allPendingRequest) {
        setLeaveRequests(data.allPendingRequest);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleDenyPress = item => {
    setSelectedItem(item);
    setIsDenyModalVisible(true);
  };

  const handleDenyCancel = () => {
    setIsDenyModalVisible(false);
    setDenyReason('');
  };

  //approve and deny function
  const handleLeaveApproval = async (employeeId, from, to, status, message) => {
    try {
      const data = {
        employeeId: employeeId,
        from: from,
        to: to,
        status: status,
        rejectedReason: message,
      };
      console.log('patchdataon Apprve', data);
      // Send PATCH request with the data
      const response = await axios.patch(`${BASE_URL}/leave/acceptleave`, data);

      //success response'
      // Remove the approved leave request from the leaveData state
      const updatedLeaveData = leaveRequests.filter(
        item => item.employeeId._id !== employeeId,
      );
      setLeaveRequests(updatedLeaveData);

      console.log('Approval successful:', response.data);
      if (status === 'accepted') {
        showMessage({
          message: `Employee with Id ${employeeId}has been approved`,
          type: 'success',
          duration: 5000,
        });
      } else if (status === 'rejected') {
        showMessage({
          message: `Employee with id ${employeeId}has been rejected`,
          type: 'warning',
          duration: 5000,
        });
      }
    } catch (error) {
      // Handle the error if needed
      console.error('Error approving:', error);
    }
  };
  const handleGatepassApproval = async (
    employeeId,
    gatepassDate,
    gatepassTime,
    status,
    message,
  ) => {
    try {
      const data = {
        employeeId: employeeId,
        gatePassDate: gatepassDate, // Gatepass date will be used as "from" date
        gatePassTime: gatepassTime, // Assuming the gatepass is only for one day

        status: status,
        rejectedReason: message,
      };

      console.log('patchdataon Gatepass Approval', data);
      // Send PATCH request with the data to the gatepass approval endpoint
      const response = await axios.patch(
        `${BASE_URL}/leave/acceptgatepass`,
        data,
      );

      // Handle success response and remove the approved gatepass request from the leaveData state
      const updatedLeaveData = leaveRequests.filter(
        item => item.employeeId._id !== employeeId,
      );
      setLeaveRequests(updatedLeaveData);

      console.log('Gatepass approval successful:', response.data);
      if (status === 'accepted') {
        showMessage({
          message: `Employee with Id ${employeeId}has been approved`,
          type: 'success',
          duration: 5000,
        });
      } else if (status === 'rejected') {
        showMessage({
          message: `Employee with id ${employeeId}has been rejected`,
          type: 'warning',
          duration: 5000,
        });
      }
    } catch (error) {
      // Handle the error if needed
      console.error('Error approving gatepass request:', error);
    }
  };

  return (
    <View style={styles.container}>
      {leaveRequests.map(item => (
        <View key={item._id} style={styles.card}>
          <View style={{flexDirection: 'column'}}>
            <View style={{flexDirection: 'row'}}>
              <Image
                source={{
                  uri: 'https://avatars.githubusercontent.com/u/94738352?v=4',
                }}
                style={styles.photo}
              />
              <View style={{flexDirection: 'column'}}>
                <Text style={{...styles.text, marginLeft: 12}}>
                  {item.employeeId.name}
                </Text>
                {item.from && item.to ? (
                  <Text style={styles.dateText}>
                    Leave: {moment(item.from).format('Do MMM')} -{' '}
                    {moment(item.to).format('Do MMM')}
                  </Text>
                ) : (
                  <Text style={styles.dateText}>
                    {moment(item.gatePassDate).isSame(moment(), 'day') ? (
                      // If the gate pass date is the current date, display "Today" with time
                      <Text>
                        Gatepass: Today{' '}
                        {moment(item.gatePassTime, 'HH:mm').format('hh:mm a')}
                      </Text>
                    ) : (
                      // If the gate pass is for a different date, display the full date and time
                      <Text>
                        Gatepass: {moment(item.gatePassDate).format('Do MMM')}{' '}
                        {moment(item.gatePassTime, 'HH:mm').format('hh:mm a')}
                      </Text>
                    )}
                  </Text>
                )}
              </View>
            </View>

            <Text style={{...styles.textmsg, marginTop: 12}}>
              {' '}
              {item.message}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 20,
                marginBottom: 5,
                marginRight: '10%',
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  // alignItems: 'flex-start',
                }}
              >
                <TouchableOpacity
                  style={styles.Ftext}
                  onPress={() => {
                    if (item.from && item.to) {
                      handleLeaveApproval(
                        item.employeeId._id,
                        item.from,
                        item.to,
                        'accepted',
                        item.message,
                      );
                    } else {
                      handleGatepassApproval(
                        item.employeeId._id,
                        item.gatePassDate,
                        item.gatePassTime,
                        'accepted',
                        item.message,
                      );
                    }
                  }}
                >
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Feather name="check" color={'#FBFBFC'} size={20} />
                    <Text
                      style={{
                        marginLeft: 2,
                        marginRight: '3%',
                        color: '#FBFBFC',
                      }}
                    >
                      Approve
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    ...styles.Ftext,
                    backgroundColor: 'white',
                    borderColor: '#283093',
                    borderWidth: 1,
                  }}
                  onPress={() => {
                    // Show the flash message with the deny reason input
                    handleDenyPress(item);
                  }}
                >
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Feather name="x" color={'#283093'} size={20} />
                    <Text style={{marginLeft: 4, color: '#283093'}}>Deny</Text>
                  </View>
                </TouchableOpacity>
              </View>
              {/* //Date */}
              <View style={styles.rowContainer}>
                <Text
                  style={{
                    ...styles.appliedDate,
                  }}
                >
                  {moment(item.appliedDate).format('YYYY-MM-DD')}
                </Text>
              </View>
            </View>
          </View>
        </View>
      ))}
      {/* Deny Modal */}
      <DenyModal
        isVisible={isDenyModalVisible}
        onRequestClose={() => setIsDenyModalVisible(false)}
        onDeny={reason => {
          setIsDenyModalVisible(false);
          setDenyReason(reason);
          if (selectedItem.from && selectedItem.to) {
            handleLeaveApproval(
              selectedItem.employeeId._id,
              selectedItem.from,
              selectedItem.to,
              'rejected',
              reason,
            );
          } else {
            handleGatepassApproval(
              selectedItem.employeeId._id,
              selectedItem.gatePassDate,
              selectedItem.gatePassTime,
              'rejected',
              reason,
            );
          }
        }}
        onCancel={handleDenyCancel}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: '12%',
    backgroundColor: '#FFFFFF',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
  },
  dateText: {
    fontSize: 14,
    color: '#2E2E2E',
    fontWeight: '500',
    marginTop: 3,
    marginLeft: 10,
    // fontFamily: 'Inter',
  },
  text: {
    fontSize: 16,
    color: '#2E2E2E',
    fontWeight: '500',
    // fontFamily: 'Inter',
    // marginLeft: 12,
  },
  textmsg: {
    fontSize: 14,
    color: '#2E2E2E',
    fontWeight: '400',
    // fontFamily: 'Inter',
    // marginLeft: 12,
  },
  card: {
    backgroundColor: '#FBFBFC',
    padding: 20,
    marginVertical: 8,
    borderRadius: 1,
    borderColor: '#757575',
    borderWidth: 0.1,
  },
  photo: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  Ftext: {
    borderRadius: 5,

    borderColor: '#283093',
    width: '39%',
    height: 43,
    fontSize: 12,
    backgroundColor: '#283093',
    paddingHorizontal: 12,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    // borderRadius: 4,
  },
  appliedDate: {
    color: '#757575',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 30,
    // borderColor: 'yellow',
    // borderWidth: 1,
    marginRight: 30,
  },
});

export default PendingComponent;
