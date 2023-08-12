import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React, {useContext} from 'react';
import Navbar from './Navbar';
import LeaveApplication from './Leaves/ApplyLeave';
import {Button} from 'react-native-elements';
import {AuthContext} from '../context/AuthContext';
import ApproveLeave from './Leaves/ApproveLeave';
import Feather from 'react-native-vector-icons/Feather';

const Leaves = ({navigation}) => {
  const screenHeight = Dimensions.get('window').height;
  const {isLoading, isLogin, login, logout} = useContext(AuthContext);
  return (
    <SafeAreaView style={{height: screenHeight * 0.9}}>
      <Navbar />
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.div1}>
            <View style={{marginBottom: 20}}>
              <TouchableOpacity
                style={styles.Ftext}
                onPress={() => navigation.navigate('LeaveApplication')}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text
                    style={{color: '#283093', fontSize: 16, fontWeight: '500'}}
                  >
                    Apply for a Leave
                  </Text>
                  <Feather name="edit-2" color={'#283093'} />
                </View>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.Ftext}
              onPress={() => navigation.navigate('ViewLeaves')}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Text
                  style={{color: '#283093', fontSize: 16, fontWeight: '500'}}
                >
                  View Leave Records
                </Text>
                <Feather name="edit-2" color={'#283093'} />
              </View>
            </TouchableOpacity>
          </View>
          <View style={{justifyContent: 'center'}}>
            {isLogin ? <ApproveLeave /> : <Text> </Text>}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Leaves;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',

    // paddingTop: '2%',
  },
  Ftext: {
    backgroundColor: '#E6E6FA',

    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 7,
  },

  div1: {
    padding: 12,
    flexDirection: 'column',
  },
  innerBtn: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 4,
    borderWidth: 0.3,
    backgroundColor: '#F0F0F0',
    borderColor: '#C8C8C8',
  },
});
