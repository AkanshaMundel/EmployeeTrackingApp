import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import {Dimensions} from 'react-native';
const screenHeight = Dimensions.get('window').height;
import React, {useContext, useEffect, useState} from 'react';
import Navbar from './Navbar';
import {Button} from 'react-native-elements';
import {AuthContext} from '../context/AuthContext';
import CardArray from './CardArray';
import Feather from 'react-native-vector-icons/Feather';
import axios from 'axios';
import {BASE_URL} from '../ConfigLinks';
import {showMessage} from 'react-native-flash-message';
const Attendance = ({navigation}) => {
  const {isLogin, userInfo} = useContext(AuthContext);
  const [refreshing, setRefreshing] = useState(false);
  const [cardArrayRefresh, setCardArrayRefresh] = useState(false);
  const [dataAttendance, setDataAttendance] = useState({
    totalPresent: 0,
    totalAbsent: 0,
    totalEmployees: 0,
    working: 0,
  });
  useEffect(() => {
    fetchDataAttendaceNumber();
  }, [dataAttendance]);
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDataAttendaceNumber(); // Refresh the attendance data
    setCardArrayRefresh(prev => !prev); // Toggle the state to refresh the CardArray component
    setRefreshing(false);
  };
  const fetchDataAttendaceNumber = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/attendance/getPunchInPunchOut`,
      );
      const data = response.data;
      const countIn = data.countIn;
      const countOut = data.countOut;
      const totalEmployees = data.totalEmployees;
      const totalPresent = data.totalPresent;
      const totalAbsent = totalEmployees - totalPresent;
      const working = countIn - countOut;
      setDataAttendance({
        totalEmployees: totalEmployees,
        totalPresent: totalPresent,
        totalAbsent: totalAbsent,
        working: working,
      });
      // console.log('atttttttttnd', setDataAttendance);
    } catch (error) {
      console.error(error);
    }
  };
  const screenHeight = Dimensions.get('window').height;
  const handleAttendance = () => {
    navigation.navigate('TableComp');
  };
  return (
    <View style={{height: screenHeight * 0.9}}>
      <SafeAreaView style={styles.container}>
        <Navbar />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <TouchableOpacity style={styles.Ftext} onPress={handleAttendance}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <Text
                  style={{
                    color: '#283093',
                    fontSize: 16,
                    fontWeight: '500',
                  }}
                >
                  View Attendance Records
                </Text>
                <Feather size={15} color={'#283093'} name="external-link" />
              </View>
            </TouchableOpacity>
          </View>
          <View>
            <View style={styles.div1}>
              <Text style={styles.HeadTxt}>Daily Staff Check-in</Text>
            </View>
            <View style={styles.subdiv1}>
              <View style={styles.subdiv2}>
                <View style={styles.subdiv3}>
                  <View style={styles.subdiv4}>
                    <Text style={styles.num}>
                      {dataAttendance.totalPresent}
                    </Text>
                    <Feather name="arrow-up" size={18} color={'#4B0082'} />
                  </View>
                  <Text style={styles.numTxt}>Present</Text>
                </View>
              </View>
              <View style={styles.subdiv2}>
                <View style={styles.subdiv3}>
                  <View style={styles.subdiv4}>
                    <Text style={styles.num}>{dataAttendance.totalAbsent}</Text>
                    <Feather name="arrow-up" size={18} color={'#4B0082'} />
                  </View>
                  <Text style={styles.numTxt}>Absent</Text>
                </View>
              </View>
              <View style={styles.subdiv2}>
                <View style={styles.subdiv3}>
                  <View style={styles.subdiv4}>
                    <Text style={styles.num}>{dataAttendance.working}</Text>
                    <Feather name="arrow-up" size={18} color={'#4B0082'} />
                  </View>
                  <Text style={styles.numTxt}>Working</Text>
                </View>
              </View>
            </View>
          </View>
          <CardArray onRefresh={cardArrayRefresh} />
          {/* {userInfo.employee.role==='supervisor'|| userInfo.employee.role==='admin'? <CardArray /> : <Text> </Text>} */}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};
export default Attendance;
const styles = StyleSheet.create({
  Ftext: {
    width: '90%', //350
    // height: '50%', //42
    color: '#283093',
    fontSize: 16,
    fontWeight: '500',
    backgroundColor: '#E6E6FA',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 7,
    // marginRight:24,
    justifyContent: 'center',

    marginTop: 15,
    flex: 1,
    // marginLeft: '2%',
  },
  scrollContent: {
    flexGrow: 2,
    paddingBottom: 1,
    // paddingVertical: 20,
    // marginBottom: 10,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
    // alignItems: 'center',
    // paddingHorizontal: 25,
    // paddingVertical: 30,
  },
  div1: {
    paddingTop: 35,
  },
  subdiv1: {
    flexDirection: 'row',
    paddingHorizontal: 12, //12
    paddingVertical: 13, //13
    justifyContent: 'space-evenly',
  },
  subdiv2: {
    // width: 20,
    height: 80,
    width: '30%',
    padding: 8,
    borderRadius: 9,
    borderWidth: 0.5,
    backgroundColor: '#FBFBFC',
    borderColor: '#C8C8C8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  subdiv3: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  subdiv4: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
  },
  num: {color: '#4B0082', fontSize: 20, fontWeight: 'bold'},
  numTxt: {fontSize: 11, fontWeight: '400', color: '#000'},
  HeadTxt: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    fontFamily: 'Inter',
    marginLeft: 17,
  },
});
