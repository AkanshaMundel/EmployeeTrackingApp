import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { ActivityIndicator } from 'react-native-paper'

const LoadingScreen = () => {
  return (
    <View style={{flex:1,justifyContent:"center"}}>
    <ActivityIndicator size={100} color='blue'/>
    </View>
  )
}

export default LoadingScreen

const styles = StyleSheet.create({})