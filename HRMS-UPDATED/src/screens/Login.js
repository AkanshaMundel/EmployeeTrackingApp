import React, {useContext, useState} from 'react';
import {
  Button,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import {AuthContext} from '../context/AuthContext';
import Feather from 'react-native-vector-icons/Feather';
import {showMessage} from 'react-native-flash-message';
const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const {isLoading, isLogin, login, logout} = useContext(AuthContext);
  console.log('login', login);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const handlePasswordChange = text => {
    setPassword(text);
  };
  const handleLogin = () => {
    login(email, password);
    navigation.navigate('SplashScreen');
  };
  const handleLogout = () => {
    logout();
    // alert('logout successfully');
    showMessage({
      message: 'Logout Successful',
      type: 'success',
      floating: true,
    });
    navigation.navigate('LoginScreen');
  };
  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <View style={{justifyContent: 'center'}}>
          <Text
            style={{
              color: 'black',
              fontFamily: 'Inter',
              fontWeight: '700',
              paddingVertical: 30,
              fontSize: 25,
            }}
          >
            Employee Login
          </Text>
          <View style={{paddingBottom: 15}}>
            <Text style={styles.labelTxt}>Email or Phone Number</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={text => setEmail(text)}
            />
          </View>
          <View style={{paddingBottom: 15}}>
            <Text style={styles.labelTxt}>Password</Text>
            <View style={styles.passwordInputWrapper}>
              <TextInput
                style={styles.passwordInput}
                value={password}
                onChangeText={handlePasswordChange}
                secureTextEntry={!showPassword} // Toggle secureTextEntry based on showPassword state
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={togglePasswordVisibility}
              >
                <Feather
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={18}
                  color={'black'}
                />
              </TouchableOpacity>
            </View>
            <View style={{marginTop: 12}}>
              <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <View style={{flexDirection: 'row'}}>
                  <Feather name="log-in" size={18} color={'white'} />
                  <Text style={styles.buttonText}>Login</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    // flex: 1,
    paddingTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrapper: {
    width: '90%',
  },
  labelTxt: {
    color: 'black',
    fontWeight: '400',
    fontFamily: 'Inter',
    paddingBottom: 10,
    marginRight: 12,
    paddingTop: 12,
  },
  input: {
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#666666',
    borderRadius: 5,
    paddingHorizontal: 14,
  },
  button: {
    backgroundColor: '#283093',
    // padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    // width:102,
    height: 45,
    // padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: '30%',
    paddingHorizontal: 5,
    paddingVertical: 3,
    // height: '20%',
  },
  buttonText: {
    color: 'white',
    paddingLeft: 10,
    // textAlign: 'center',
  },
  link: {
    backgroundColor: '#283093',
    color: 'white',
    padding: 10,
    borderRadius: 10,
  },
  eyeButton: {
    padding: 8,
  },
  passwordInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#666666',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 8,
    color: 'black',
  },
});
export default LoginScreen;