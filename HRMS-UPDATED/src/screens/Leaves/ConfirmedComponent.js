import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import axios from 'axios';
import moment from 'moment';
import {BASE_URL} from '../../ConfigLinks';
import Feather from 'react-native-vector-icons/Feather';
import {showMessage} from 'react-native-flash-message';

const ConfirmedComponent = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);

  useEffect(() => {
    fetchDataFromAPI();
  }, [leaveRequests]);

  const fetchDataFromAPI = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/leave/accepted`);
      const data = response.data;
      console.log('dataconfrim', data);

      if (data.success && data.allAcceptedRequest) {
        setLeaveRequests(data.allAcceptedRequest);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
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
              }}
            >
              <View style={{justifyContent: 'flex-start'}}>
                <View
                  style={{
                    flexDirection: 'row',
                    backgroundColor: '#E9F7EF',
                    borderRadius: 15,
                    padding: 5,
                    paddingHorizontal: 6,
                  }}
                >
                  <Feather
                    name="check"
                    color={'#186A3B'}
                    size={15}
                    style={{marginRight: 4}}
                  />
                  <Text style={{fontSize: 12, color: '#186A3B'}}>
                    Confirmed
                  </Text>
                </View>
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
    padding: 16,
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
    marginLeft: '50%',
  },
  rowContainer: {
    justifyContent: 'flex-end',
    // alignItems: 'flex-end',
    // marginTop: 30,
    // borderColor: 'yellow',
    // borderWidth: 1,
    // marginRight: 50,
  },
});

export default ConfirmedComponent;
