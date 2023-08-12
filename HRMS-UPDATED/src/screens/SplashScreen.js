import React, {useContext, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Image} from 'react-native';
import {AuthContext} from '../context/AuthContext';
const SplashScreen = ({navigation}) => {
  const {isLoading, isLogin, userInfo, loginres} = useContext(AuthContext);
  const [showSplash, setShowSplash] = useState(true);
  console.log('islogin', loginres);
  useEffect(() => {
    // If the user is already logged in and userInfo.admin is false,
    // reset the navigation stack to the Home screen.
    if (isLogin) {
      const resetAction = navigation.reset({
        index: 0,
        routes: [{name: 'Header'}],
      });
      navigation.dispatch(resetAction);
    }
    // Show the splash screen for at least 30 seconds (30000 milliseconds)
    const minimumSplashTime = 3000;
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, minimumSplashTime);
    return () => clearTimeout(timer);
  }, [isLogin, navigation]);
  return showSplash ? (
    <View style={styles.container}>
      <View style={styles.centeredContent}>
        <Image
          style={styles.image}
          source={require('../../assets/metalogo.png')}
        />
        <Text> </Text>
        <Text style={{color: '#283093', fontSize: 23}}>
          Welcome to Chawla Ispat Group
        </Text>
        <Text> </Text>
        <ActivityIndicator size="large" color="black" />
      </View>
    </View>
  ) : loginres?.status == 200 ? (
    navigation.navigate('Header')
  ) : (
    navigation.navigate('LoginScreen')
  );
};
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: windowWidth * 0.9,
    height: windowHeight * 0.4,
  },
});
export default SplashScreen;
