import { ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import AuthProvider from './src/context/AuthContext'
import Home from './src/screens/HomeScreen'
import Routes from './src/navigation/Routes'
import FlashMessage from 'react-native-flash-message'

const App = () => {
  return (
    <AuthProvider>
      <FlashMessage position="top" />
       <Routes/>
    </AuthProvider>
  )
}

export default App

const styles = StyleSheet.create({})