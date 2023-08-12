import axios from 'axios';
import React, { useState ,useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {Calendar,LocaleConfig } from 'react-native-calendars';
import { BASE_URL } from '../ConfigLinks';
LocaleConfig.locales['en'] = {
  monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
};

const CalendarScreen = () => {
  useEffect(() => {
    getleave()
  },[]);
  const today = new Date().toISOString().split('T')[0];
  //console.log(today)
  const [leaves,setLeaves]=useState([])
  const getleave=()=>{
    axios.get(`${BASE_URL}/leave/myleave/`).then(res=>{
     //console.log()
     setLeaves(res.data.leaves)

    }).catch(err=>{
      console.log("err")
    })
  }


const markedDates = {};

// Get the current year and month
const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth()+1 ;


leaves.forEach((leave) => {
  if (leave.from && leave.to) {
    const fromDate = new Date(leave.from).toISOString().split('T')[0];
    const toDate = new Date(leave.to).toISOString().split('T')[0];

    let currentDate = new Date(fromDate);
    while (currentDate <= new Date(toDate)) {
      const dateString = currentDate.toISOString().split('T')[0];
      markedDates[dateString] = {
        customStyles: {
          container: {
            backgroundColor: '#8A2626',
            elevation: 1,
          },
          text: {
            color: '#FAFAFA',
          },
        },
      };
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }
});




  
  
  
  const calendarTheme = {
    textMonthFontWeight: 'bold',
    textMonthFontSize: 20,
    monthTextColor: '#283093',
    arrowColor: 'black',
  };


  return (
    <View style={styles.container}>
      <Calendar
        current={new Date()}
        markingType={'custom'}
        markedDates={markedDates}
        theme={calendarTheme}
         hideExtraDays
        
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
   padding:2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1,
    borderRadius: 9,
    elevation: 3,
    backgroundColor: '#F8F8F8',

  },
  
 
});

export default CalendarScreen;
