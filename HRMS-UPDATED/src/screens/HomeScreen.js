import React, {useContext, useEffect, useState} from 'react';
import {Button, ScrollView, StyleSheet, Text, View} from 'react-native';
import {AuthContext} from '../context/AuthContext';
import {SafeAreaView, Image, TouchableOpacity} from 'react-native';
import Navbar from './Navbar';
import QRCode from 'react-native-qrcode-svg';
import Header from './Header';
import CalendarScreen from '../component/Calender';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Dimensions} from 'react-native';
import io from 'socket.io-client';
import {BASE_URL, RBASE_URL} from '../ConfigLinks';
import axios from 'axios';
import MIcon from 'react-native-vector-icons/AntDesign';

const Home = ({navigation}) => {
  const {userInfo, isLoading, logout} = useContext(AuthContext);
  const [jobProfiles, setJobProfiles] = useState([]);
  console.log(userInfo.admin);
  const {employee} = userInfo;
  const name = employee ? employee.name : 'User';
  const currentBarCode = employee ? employee.currentBarCode : 'null';
  const screenHeight = Dimensions.get('window').height;
  console.log(currentBarCode);
  let id;

  if (userInfo.admin) {
    id = userInfo?.admin?._id;
  } else {
    id = userInfo?.employee?._id;
  }
  useEffect(() => {
    setupSocketConnection();
  }, []);
  const setupSocketConnection = () => {
    const socket = io(RBASE_URL, {query: {employeeId: id}});

    socket.on('connect', () => {
      console.log('Connected to websocket');
    });

    socket.on('notification', notification => {
      console.log('notification.... ', notification);
      const length = notification.notification.length;
      Alert.alert(notification.notification[length - 1].message);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from websocket');
    });

    socket.on('error', error => {
      console.log(error.message);
    });

    return () => {
      socket.disconnect();
    };
  };

  useEffect(() => {
    const fetchDataFromAPI = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/attendance/staffAttendance`,
        );
        const data = response.data.data;
        console.log('datastaff ', data);

        const jobProfilesData = data.map(item => {
          return {
            jobProfileName: item.thisJobProfile.jobProfileName,
            totalPresent: item.todayPresent,
            totalEmployees: item.totalEmployees,
          };
        });

        setJobProfiles(jobProfilesData);
      } catch (error) {
        console.error('Error fetching data from API:', error);
        // Handle errors
      }
    };

    // Call the fetchDataFromAPI function when the component mounts
    fetchDataFromAPI();
  }, []);
  return (
    <View style={{height: screenHeight * 0.8}}>
      <SafeAreaView>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.div}>
            <View>
              <Text style={styles.text}>Welcome Back {name}!</Text>
            </View>
            <View style={styles.qrContainer}>
              <Text
                style={{
                  marginBottom: 5,
                  fontWeight: '600',
                  fontFamily: 'Inter',
                  color: '#2E2E2E',
                  fontSize: 15,
                }}
              >
                Your Employee Barcode
              </Text>
              <Image
                style={{width: 250, height: 200, alignItems: 'center'}}
                source={{uri: `${currentBarCode}`}}
              />
            </View>

            <View>
              <Text style={styles.text}>Staff Attendance</Text>
            </View>
            {jobProfiles.length > 0 ? (
              <View
                style={{
                  height: 100,
                }}
              >
                <ScrollView
                  horizontal // Enable horizontal scrolling
                  showsHorizontalScrollIndicator={false} // Hide horizontal scroll indicator
                  contentContainerStyle={styles.horizontalScrollContainer}
                >
                  {jobProfiles.map((profile, index) => (
                    <View
                      key={index}
                      style={{
                        width: 200,
                        backgroundColor: 'white',
                        borderRadius: 8,
                        borderWidth: 1,
                        borderColor: '#DEDEDE',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        margin: 10,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginTop: 10,
                        }}
                      >
                        {/* <View style={{flexDirection: 'row'}}> */}
                        <MIcon name="loading1" size={15} color="#283093" />
                        <Text
                          style={{
                            color: '#283093',
                            fontWeight: '700',
                            fontSize: 15,
                            marginLeft: '4%',
                          }}
                        >
                          {profile.totalPresent}
                        </Text>
                        <Text
                          style={{
                            color: '#283093',
                            fontWeight: '700',
                            fontSize: 15,
                          }}
                        >
                          /
                        </Text>
                        <Text
                          style={{
                            color: '#283093',
                            fontWeight: '700',
                            fontSize: 15,
                          }}
                        >
                          {profile.totalEmployees}
                        </Text>
                      </View>
                      <Text
                        style={{
                          color: 'black',
                          fontWeight: '500',
                          fontSize: 18,
                          marginBottom: '5%',
                        }}
                      >
                        {profile.jobProfileName}
                      </Text>
                    </View>
                  ))}
                </ScrollView>
              </View>
            ) : (
              <Text style={{textAlign: 'center', color: 'black', fontSize: 15}}>
                No Staff Present
              </Text>
            )}

            <View style={styles.div1}>
              <View style={styles.subdiv}>
                <Text style={styles.text}>Your Leaves</Text>
              </View>
              <View>
                <CalendarScreen />
              </View>
            </View>
            <View>
              <View style={{marginTop: 20}}>
                <Text style={styles.text}>Quick Links</Text>
              </View>
              <View style={styles.footer}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Training')}
                >
                  <View style={styles.linkContainer}>
                    <Icon
                      name="users"
                      size={16}
                      color="blue"
                      style={styles.arrowIcon}
                    />
                    <Text style={styles.linkText}>Training</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Document')}
                >
                  <View style={styles.linkContainer}>
                    <Icon
                      name="file"
                      size={16}
                      color="blue"
                      style={styles.arrowIcon}
                    />
                    <Text style={styles.linkText}>Documents</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  subdiv: {
    paddingVertical: 5,
  },
  div: {
    paddingHorizontal: 20,
    paddingVertical: 25,
    justifyContent: 'center',
  },
  qrContainer: {
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 3,
    borderRadius: 9,
    paddingVertical: 30,
    backgroundColor: 'white', //#F0F0F0
    flexDirection: 'column',
  },

  text: {
    color: '#2E2E2E',
    fontSize: 23,
    fontWeight: '700',
    marginBottom: 20,
    fontFamily: 'Inter',
  },
  footer: {
    padding: 6,
    flexDirection: 'row',
    alignItems: 'center',

    justifyContent: 'space-around', // Align links to the left
  },

  Ftext: {
    color: '#283093',
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 2,
    borderRadius: 7,
  },
  div1: {},
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: '#ECEDFE',
    borderRadius: 5,
    // padding: 8,
    paddingLeft: 10,
    width: 150,
    height: 50,
    marginLeft: '2%',
    marginRight: '2%',
  },
  arrowIcon: {
    marginRight: '10%',
  },
  linkText: {
    color: '#283093',
    fontWeight: '500',
    fontSize: 16,
  },
});

export default Home;
