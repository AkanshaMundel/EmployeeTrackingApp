import {StyleSheet, Text, View} from 'react-native';
import React,{useContext} from 'react';
import {AuthContext} from '../context/AuthContext';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Header from '../screens/Header';
import Attendance from '../screens/Attendance';
import Home from '../screens/HomeScreen';
import Leaves from '../screens/Leaves';
import Notifications from '../screens/Notifications';
import Feather from 'react-native-vector-icons/Feather';
import LoginScreen from '../screens/Login';
import RegisterScreen from '../screens/Register';
import LeaveApplication from '../screens/Leaves/ApplyLeave';
import ViewLeave from '../screens/Leaves/ViewLeave';
import ApproveLeave from '../screens/Leaves/ApproveLeave';
import TableComp from '../screens/TableComp';
import SplashScreen from '../screens/SplashScreen';

import Icon from 'react-native-vector-icons/FontAwesome';
import MIcon from 'react-native-vector-icons/FontAwesome5';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import NIcon from 'react-native-vector-icons/Ionicons';
import Document from '../screens/Document';
import Training from '../screens/Training';
import Assessment from '../screens/Assessment';
import AssessmentResult from '../screens/AssessmentResult';
import FileView from '../screens/FileView';
import DocumentView from '../screens/DocumentView';

const Routes = () => {
  const HomeStack = createNativeStackNavigator();
  const AttendanceStack = createNativeStackNavigator();
  const LeaveStack = createNativeStackNavigator();
  const NotificationStack = createNativeStackNavigator();
  const LoginStack=createNativeStackNavigator();
  const Tab = createBottomTabNavigator();
  const {isLogin, userInfo} = useContext(AuthContext);

  const HomeScreen = () => (
    <HomeStack.Navigator initialRouteName="Header">
      <HomeStack.Screen
        name="Header"
        component={Header}
        options={{headerShown: false}}
      />
      <HomeStack.Screen name="Home" component={Home} />
      <HomeStack.Screen name="LoginScreen" component={LoginScreen} />
      <HomeStack.Screen
        name="SplashScreen"
        component={SplashScreen}
        options={{headerShown: false}}
      />
      <HomeStack.Screen name="Register" component={RegisterScreen} />
      <HomeStack.Screen name="Document" component={Document} />
      <HomeStack.Screen name="Training"  component={Training} />
      <HomeStack.Screen
        name="Assessment"
        component={Assessment}
        options={{ headerShown: false }} // Hide the header for the Assessment screen
      />
      <HomeStack.Screen
        name="AssessmentResult"
        component={AssessmentResult}
        options={{ headerShown: false}} // Hide the header for the AssessmentResult screen
      />
     
      <HomeStack.Screen name="FileView" component={FileView} />
      <HomeStack.Screen name="DocumentView" component={DocumentView}  options={{ headerShown: false }} />
     
    </HomeStack.Navigator>
  );
  const AttendanceScreen = () => (
    <AttendanceStack.Navigator>
      <AttendanceStack.Screen
        name="Attendance"
        component={Attendance}
        options={{headerShown: false}}
      />
      <AttendanceStack.Screen
        name="TableComp"
        component={TableComp}
        options={{headerShown: false}}
      />
    </AttendanceStack.Navigator>
  );
  const LeaveScreen = () => (
    <LeaveStack.Navigator>
      <LeaveStack.Screen
        name="Leaves"
        component={Leaves}
        options={{headerShown: false}}
      />
      <LeaveStack.Screen
        name="LeaveApplication"
        component={LeaveApplication}
        options={{headerShown: false}}
      />
      <LeaveStack.Screen
        name="ViewLeaves"
        component={ViewLeave}
        options={{ headerShown: false}}
      />
      <LeaveStack.Screen
        name="ApproveLeave"
        component={ApproveLeave}
        options={{headerShown: true}}
      />
    </LeaveStack.Navigator>
  );
  const NotificationScreen = () => (
    <NotificationStack.Navigator>
      <NotificationStack.Screen
        name="Notifications"
        component={Notifications}
        options={{headerShown: false}}
      />
    </NotificationStack.Navigator>
  );
  const LoginStackNavigator = () => (
    <LoginStack.Navigator>
      <LoginStack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
       <LoginStack.Screen
        name="SplashScreen"
        component={SplashScreen}
        options={{ headerShown: false }}
      />
     
    </LoginStack.Navigator>
  );
  return (
    <NavigationContainer>
      {isLogin?(
      <Tab.Navigator
        screenOptions={{
          tabBarShowLabel: true,
          tabBarActiveTintColor: '#283093',
          tabBarInactiveTintColor: 'black',
          // tabBarAllowFontScaling:true,
          tabBarLabelStyle: {fontSize: 13},
          tabBarItemStyle: {
            marginBottom: 10,
            // marginStart:,
            marginRight: 14,
            // justifyContent:'space-around',
            // width: 60,

            // height:50
          },
          tabBarStyle: {
            backgroundColor: '#F8F8F8',
            // position: 'absolute',
            // width:420,
            // height:65,
            width: '100%',
            height: '8%',

            borderRadius: 5,
            // bottom:10,
            // marginTop:10,
            // paddingBottom:12,
            paddingTop: 6,
            // marginHorizontal:0,
          },
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerShown: false,
            unmountOnBlur: true,
            tabBarIcon: ({focused}) => (
              // <Icon name="fa-solid fa-house"/>
              <Icon
                name="home"
                size={30}
                color={focused ? '#283093' : '#181818'}
                // style={styles.arrowIcon}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Attendance"
          component={AttendanceScreen}
          options={{
            headerShown: false,
            unmountOnBlur: true ,
            tabBarHideOnKeyboard:true,
            
            tabBarIcon: ({focused}) => (
              // <Icon
              //   name="user-check"
              //   size={30}
              //   color={focused ? '#283093' : '#181818'}
              //   // style={styles.arrowIcon}
              // />
              
              // <Icon name={iconName} size={24} color={iconColor} />
              <MIcon
                name="user-check"
                size={25}
                color={focused ? '#283093' : '#181818'}
              /> // Modified color prop */}
            ),
          }}
        />
        <Tab.Screen
          name="Leaves"
          component={LeaveScreen}
          options={{
            unmountOnBlur: true,
            headerShown: false,
            tabBarHideOnKeyboard:true,
            tabBarIcon: ({focused}) => (
              <MaterialIcon
                name="airplane"
                size={30}
                color={focused ? '#283093' : '#181818'}
              /> // Modified color prop
            ),
          }}
        />
        <Tab.Screen
          name="Notifications"
          component={NotificationScreen}
          options={{
            headerShown: false,
            tabBarIcon: ({focused}) => (
              <NIcon
                name="notifications"
                size={30}
                color={focused ? '#283093' : '#181818'}
              /> // Modified color prop
            ),
          }}
        />
      </Tab.Navigator>
      ):(
       <LoginStackNavigator/>    )}
    </NavigationContainer>
    
  );
};

export default Routes;
