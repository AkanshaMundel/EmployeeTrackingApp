import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Navbar from './Navbar';
import { AuthContext } from '../context/AuthContext';
import { BASE_URL } from '../ConfigLinks';
import axios from 'axios';
import { showMessage } from 'react-native-flash-message';

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const { isLogin,userInfo } = useContext(AuthContext);
  let id;
  console.log(userInfo);
  if(userInfo.admin){
    id=userInfo?.admin?._id;
  }else{
    id=userInfo?.employee?._id;
  }
  console.log(notifications);
  useEffect(() => {
    // Fetch notifications from the API
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/notifications/${id}`);
        console.log("data",res.data.notification)
        setNotifications(res.data.notification);
      } catch (error) {
        console.error(error);
      }
    };
    fetchNotifications();
  }, [isLogin]);

  const renderNotification = ({ item }) => {
    let iconName;
    let iconColor;

    switch (item.notificationType) {
      case 'Alert':
        iconName = 'exclamation-circle';
        iconColor = 'red';
        break;
      case 'Info':
        iconName = 'info-circle';
        iconColor = 'blue';
        break;
      case 'High alert':
        iconName = 'warning';
        iconColor = '#8A2626';
        break;
      default:
        iconName = 'bell';
        iconColor = '#283093';
        break;
    }

    return (
      <TouchableOpacity style={styles.notificationContainer}>
        <View style={styles.iconContainer}>
          <Icon name={iconName} size={24} color={iconColor} />
        </View>
        <View style={styles.notificationDetails}>
          <Text style={styles.notificationMessage}>{item.message}</Text>
          <Text style={styles.notificationTime}>{formatTime(item.date)}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return  date.toISOString().split('T')[0];
  };

  return (
    <View style={styles.container}>
      <Navbar />
      {isLogin ? (
        <>
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>Notifications</Text>
          </View>
          <View style={styles.contentContainer}>
            <FlatList
              data={notifications}
              keyExtractor={(item) => item._id}
              renderItem={renderNotification}
            />
          </View>
        </>
      ) : (
        showMessage({
          message:'Login First',
          duration:3000,
          status:'warning',
        })
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  headerText: {
    color: 'black',
    fontSize: 20,
    fontWeight: '700',
    marginRight:220
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  notificationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  iconContainer: {
    marginRight: 12,
  },
  notificationDetails: {
    flex: 1,
  },
  notificationMessage: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
    color: 'black',
  },
  notificationTime: {
    fontSize: 12,
    color: '#888',
  },
});


export default NotificationsScreen;