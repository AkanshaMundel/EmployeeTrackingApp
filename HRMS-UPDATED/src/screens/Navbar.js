import {Image, StyleSheet, Text, View, Dimensions} from 'react-native';
import React from 'react';

const Navbar = () => {
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
      </View>
    </View>
  );
};

export default Navbar;

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
