import { StyleSheet } from 'react-native';
import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../ConfigLinks';
import { showMessage } from 'react-native-flash-message';
export const AuthContext = createContext();
const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isLogout, setIsLogout] = useState(true);
  const [isLogin, setIsLogin] = useState(false);
  const [error, setError] = useState(false);
  const [data, setData] = useState([]);
  const [loginres, setLoginres] = useState([]);
  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const phoneOrEmailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      if (phoneOrEmailRegex.test(email)) {
        let { data } = await axios.post(`${BASE_URL}/auth/admin/login`, {
          email,
          password,
        });
        setIsLogin(true);
        console.log('I am calling from res', data);
        setLoginres(data);
        console.log('setLoginres', setLoginres);
        // alert('Login successful');
        showMessage({
          message: 'Login Successful',
          type: 'success',
          floating: true,
        });
        myProfile();
        setError(false);
      } else {
        let { data } = await axios.post(`${BASE_URL}/auth/admin/login`, {
          phone: parseInt(email),
          password,
        });
        setIsLogin(true);
        // console.log('I am calling from res', res);
        setLoginres(data);
        // alert('Login successful');
        showMessage({
          message: 'Login Successful',
          type: 'success',
          floating: true,
        });
        myProfile();
        setError(false);
      }
    } catch (err) {
      alert('Login failed');
      setLoginres([]); // Reset login response
      setIsLogin(false); // Reset login status
      setError(true);
      showMessage({
        message: err.response.data.message,
        type: 'danger',
        floating: true,
      });
      console.log(err.response);
    } finally {
      setIsLoading(false);
    }
  };
  const myProfile = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/auth/myprofile`);
      const user = res.data;
      setUserInfo(user);
      setIsLoading(false);
      console.log(user);
      AsyncStorage.setItem('userInfo', JSON.stringify(user));
    } catch (err) {
      console.log(`Profile Error: ${err}`);
    }
  };
  const logout = async () => {
    //console.log("hiii")
    setIsLoading(true);
    try {
      await axios.get(`${BASE_URL}/logout`);
      AsyncStorage.removeItem('userInfo');
      setUserInfo({});
      setIsLogout(true);
      setIsLogin(false);
    } catch (err) {
      console.log(`Logout Error: ${err}`);
    } finally {
      setIsLoading(false);
    }
  };
  const isLoggedIn = async () => {
    try {
      setSplashLoading(true);
      const userInfo = JSON.parse(await AsyncStorage.getItem('userInfo'));
      if (userInfo) {
        setUserInfo(userInfo);
        alert(userInfo);
      }
    } catch (error) {
      console.log(`IsLoggedIn Error: ${error}`);
    } finally {
      setSplashLoading(false);
    }
  };
  const mapAttendanceData = user => {
    return user.docs.map(item => ({
      id: item._id,
      employeeId: item.employeeId,
      attendance: item.attendance,
      createdAt: item.createdAt,
      isPresent: item.isPresent,
      updatedAt: item.updatedAt,
    }));
  };
  const fetchDataAttendance = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/attendance`);
      const user = res?.data;
      const parsedData = user;
      if (parsedData.success && parsedData.docs) {
        setData(mapAttendanceData(parsedData));
        setIsLogin(true);
        alert('Attendance successful');
      } else {
        console.log('Invalid data format:', parsedData);
      }
    } catch (err) {
      console.log(`API Error: ${err}`);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    isLoggedIn();
  }, []);
  return (
    <AuthContext.Provider
      value={{
        isLoading,
        isLogin,
        userInfo,
        login,
        logout,
        data,
        isLogout,
        fetchDataAttendance,
        loginres,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export default AuthProvider;
const styles = StyleSheet.create({});