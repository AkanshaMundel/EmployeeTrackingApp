import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Feather from 'react-native-vector-icons/Feather';
import axios from 'axios';
import {BASE_URL} from '../ConfigLinks';
import {showMessage} from 'react-native-flash-message';

const CardArray = ({onRefresh}) => {
  const [pendingEmployees, setPendingEmployees] = useState([]);

  useEffect(() => {
    fetchData();
  }, [onRefresh, pendingEmployees]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/attendance`);
      const data = response.data;
      const allPendingPunches = data.attendanceRecords.reduce(
        (result, employee) => {
          // console.log('result', result);
          // console.log('Employesssssssssssssssssss', employee);
          const pendingPunches = employee.punches.filter(
            el => el.status === 'pending',
          );
          if (pendingPunches.length > 0) {
            result.push(
              ...pendingPunches.map(punch => ({
                Name: employee.employeeId.name,
                Time: punch.punchIn,
                jobProfileDes: employee.employeeId.jobProfileId.jobProfileName,
                Id: employee.employeeId._id,
                profilePic: employee.profilePicture,
              })),
            );
          }
          return result;
        },
        [],
      );
      // console.log('277', allPendingPunches);
      setPendingEmployees(allPendingPunches);
    } catch (error) {
      console.error('errA', error);
      return [];
    }
  };

  const handleAction = async (employeeId, status, punchIn) => {
    try {
      // console.log('timmme' + punchIn);
      const requestData = {
        employeeId: employeeId,
        status: status, // usin' the provided status
        punchInTime: punchIn,
      };
      // console.log('patch data', requestData);

      const response = await axios.patch(
        `${BASE_URL}/attendance/updateAttendance`,
        requestData,
      );
      // console.log(response.data);
      // Update the pendingEmployees state by removing the approved/rejected employee --> by checking it prev one
      setPendingEmployees(prevEmployees =>
        prevEmployees.filter(employee => employee.Time !== punchIn),
      );
      if (status === 'approved') {
        showMessage({
          message: `Employee with punchin-Time ${new Date(
            punchIn,
          ).toLocaleTimeString()} has been approved.`,
          type: 'success',
          duration: 5000,
        });
      } else if (status === 'rejected') {
        showMessage({
          message: `Employee with punchin-Time ${new Date(
            punchIn,
          ).toLocaleTimeString()}  has been denied.`,
          type: 'warning',
          duration: 5000,
        });
      }
    } catch (error) {
      console.error('patcherror', error);
    }
  };
  return (
    <SafeAreaView>
      <View style={styles.container}>
        {pendingEmployees.map(employee => (
          <View key={employee.Time} style={styles.card}>
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {employee.profilePic ? (
                  <Image
                    source={{
                      uri: employee.profilePic,
                    }}
                    style={styles.photo}
                  />
                ) : (
                  <Image
                    source={{
                      uri:
                        'https://avatars.githubusercontent.com/u/94738352?v=4',
                    }}
                    style={styles.photo}
                  />
                )}

                <View style={{flexDirection: 'column', paddingLeft: 10}}>
                  <Text style={styles.name}>{employee.Name}</Text>
                  <Text style={{...styles.punchIn, marginTop: 1, fontSize: 10}}>
                    Punch In: {new Date(employee.Time).toLocaleTimeString()}
                  </Text>

                  {/* <Text >Employee ID: {employee.employeeId._id}</Text>  */}
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#ECEDFE',
                  marginTop: 12,
                  width: '50%',
                  height: 30,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 12,
                  borderWidth: 0.011,
                }}
              >
                <Feather size={15} color={'#283093'} name="briefcase" />
                <Text style={{color: '#283093', marginLeft: 5}}>
                  {employee.jobProfileDes}
                </Text>
              </View>
              <Text style={styles.punchIn}>
                Punch In: {new Date(employee.Time).toLocaleTimeString()}
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                margin: 25,
              }}
            >
              <TouchableOpacity
                style={styles.Ftext}
                onPress={() =>
                  handleAction(employee.Id, 'approved', employee.Time)
                }
              >
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Feather name="check" color={'#FBFBFC'} size={20} />
                  <Text style={{marginLeft: 4, color: '#FBFBFC'}}>Approve</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  ...styles.Ftext,
                  backgroundColor: 'white',
                  borderColor: '#283093',
                  borderWidth: 1,
                }}
                onPress={() =>
                  handleAction(employee.Id, 'rejected', employee.Time)
                }
              >
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Feather name="x" color={'#283093'} size={20} />
                  <Text style={{marginLeft: 4, color: '#283093'}}>Deny</Text>
                </View>
              </TouchableOpacity>
            </View>
            {/* // </View> */}
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
};
export default CardArray;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#FBFBFC',
    elevation: 2,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 0.3},
    shadowOpacity: 0.2,
    shadowRadius: 0.7,
    flexDirection: 'column',
  },
  photo: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  name: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000',
  },
  punchIn: {
    fontSize: 15,
    fontWeight: '500',
    color: 'black',
    marginTop: 10,
  },
  Ftext: {
    borderRadius: 5,

    borderColor: '#283093',
    width: 120,
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
});
