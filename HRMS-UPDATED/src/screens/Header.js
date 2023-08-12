import React, {useContext} from 'react';
import {
  View,
  Image,
  StyleSheet,
  Button,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {AuthContext} from '../context/AuthContext';
import Home from './HomeScreen';
import {Text} from 'react-native';
import {showMessage} from 'react-native-flash-message';
const Header = ({navigation}) => {
  const windowHeight = Dimensions.get('window').height;
  const {login, isLogin, logout, loginres} = useContext(AuthContext);
  const handleLogout = () => {
    logout();
    showMessage({
      message: 'Logout Successful',
      type: 'success',
      floating: true,
    });
    navigation.navigate('LoginScreen');
  };
  return (
    <View style={styles.header}>
      <View style={styles.container}>
        <View style={styles.logoWrapper}>
          <Image
            style={styles.logoIcon}
            resizeMode="cover"
            source={require('../../assets/metalogo.png')}
          />
          <View style={styles.companyNameWrapper}>
            <Text style={styles.companyName}>Chawla Ispat</Text>
          </View>
        </View>
        {/* <Image source={require('../../assets/logo.png')} style={styles.logo} /> */}
        {isLogin ? (
          <TouchableOpacity onPress={handleLogout}>
            <Text style={{color: 'black'}}>Logout</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
            <Text style={{color: 'black'}}>Login</Text>
          </TouchableOpacity>
        )}
      </View>
      <Home navigation={navigation} />
    </View>
  );
};
/*
Button
          title="Login"
          onPress={() => navigation.navigate('LoginScreen')}
          titleStyle={styles.button}*/
export default Header;
const styles = StyleSheet.create({
  container: {
    height: 70,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 16,
  },
  logo: {
    height: 25,
    marginLeft: 2,
  },
  header: {
    marginTop: 5,
  },
  logoWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIcon: {
    width: Dimensions.get('window').height * 0.04,
    height: Dimensions.get('window').height * 0.04,
  },
  companyNameWrapper: {
    paddingHorizontal: Dimensions.get('window').width * 0.02,
  },
  companyName: {
    fontSize: Dimensions.get('window').height * 0.025,
    color: '#283093',
    fontWeight: '500',
    // fontFamily:'In',
  },
});
