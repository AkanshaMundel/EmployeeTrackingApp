import React, { useContext, useState } from 'react';
import { Button, Text, TextInput, TouchableOpacity, View, StyleSheet } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import Feather from 'react-native-vector-icons/Feather';

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState(null);
  const [newPassword, setNewPassword] = useState(null);

  const { isLoading, forgotPassword } = useContext(AuthContext);

  const handleForgotPassword = () => {
    if (!email || !newPassword) {
      console.log('Please enter both email and new password');
      return;
    }

    forgotPassword(email, newPassword);
  };

  return (
    
    <View style={styles.container}>
    <Text
              style={{
                color: 'black',
                fontFamily: 'Inter',
                fontWeight: '700',
                paddingVertical: 30,
                fontSize: 25,
                justifyContent: 'flex-start'
              }}
            >
              Employee Register
            </Text>
      <View style={styles.wrapper}>
      <View style={{paddingBottom:10}}>
      <Text style={styles.labelTxt}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          placeholder="Enter email"
          onChangeText={text => setEmail(text)}
        />
        </View>
        <View style={{paddingBottom:10}}>
            <Text style={styles.labelTxt}>Password</Text>
        <TextInput
          style={styles.input}
          value={newPassword}
          placeholder="Enter new password"
          onChangeText={text => setNewPassword(text)}
          secureTextEntry
        />
        </View>

        {/* <Button
    
          title="Reset Password"
          onPress={handleForgotPassword}
        /> */}
        <TouchableOpacity style={styles.button} onPress={handleForgotPassword}>
            
           <Text style={styles.buttonText}>Reset Password</Text>
              
            </TouchableOpacity>
        

        <View style={{ flexDirection: 'row',  marginTop: 25, justifyContent:'center',alignItems:'center' }}>
          <Text style={styles.labelTxt}>Already have an account? </Text>
          <TouchableOpacity style={styles.button}onPress={() => navigation.navigate('LoginScreen')}>
          <View style={{flexDirection:'row'}}>
            <Feather name="log-in"  size={18} color={'white'} />
            <Text  style={{color:'white',marginLeft:4}}>Login</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    paddingTop: 20,
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginLeft:24
  },
  wrapper: {
    width: '90%',
  },
  labelTxt: {
    color: 'black',
    fontWeight: '400',
    fontFamily: 'Inter',
    paddingBottom: 10,
    marginRight:12,
    paddingTop:12,
  },
  input: {
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 5,
    paddingHorizontal: 14,
  },
  button: {
    backgroundColor: '#283093',
    padding: 5,
    justifyContent:'center',
    alignItems:'center',
    width:102,
    height:43,
    borderRadius: 5,
    marginTop: 10,
    
  },
  buttonText: {
    color: 'white',
    paddingLeft:10
    // textAlign: 'center',
  },
  link: {
    
    backgroundColor: '#283093',
    color: 'white',
    padding: 10,
    borderRadius: 10,
  },
});

export default RegisterScreen;