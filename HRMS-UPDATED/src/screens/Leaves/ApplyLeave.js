import {Picker} from '@react-native-picker/picker';
import React, {useContext, useState,useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  FlatList
} from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import Navbar from '../Navbar';
import {AuthContext} from '../../context/AuthContext';
import Feather from 'react-native-vector-icons/Feather';
import ToggleSwitch from 'toggle-switch-react-native';
import { BASE_URL } from '../../ConfigLinks';
import axios from 'axios';
import { Image } from 'react-native-elements';
import Snackbar from 'react-native-snackbar';

const LeaveApplication = () => {
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedFromDate, setSelectedFromDate] = useState('');
  const [selectedate, setSelectedDate] = useState('');
  const [selectetime, setSelectedTime] = useState('');
  const [selectedToDate, setSelectedToDate] = useState('');
  const [reason, setReason] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Loading state variable
  const {userInfo} = useContext(AuthContext);
  const {employee} = userInfo;
  const [toggle,setToggle]=useState(false)
  const [EmployeeList,setEmployeeList]=useState([])
  const currentDateTime = new Date();
  const year = currentDateTime.getFullYear();
  const month = String(currentDateTime.getMonth() + 1).padStart(2, '0');
  const date = String(currentDateTime.getDate()).padStart(2, '0');
  const [searchText, setSearchText] = useState('');
  const [showEmployeeList, setShowEmployeeList] = useState(false);
  const [Employee,setEmployee]=useState("")

  const currentTime = currentDateTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const formattedDateTime = `${year}-${month}-${date}`;
  const handleApply = () => {
    // Create an object with the data
    if(selectedOption===''){

      alert("select a application type")
    }
    else if(selectedOption==="Leave"){
    if(selectedFromDate==="" || selectedToDate==="" || reason===""){
      Snackbar.show({
        text: 'Please fill all field',
        backgroundColor:"red",
        duration: Snackbar.LENGTH_SHORT,
      });

    }
    else if(toggle && Employee===""){
      Snackbar.show({
        text: 'Please select employee',
        backgroundColor:"red",
        duration: Snackbar.LENGTH_SHORT,
      });
    }
    else{
      console.log(Employee)
    const applicationData = {
      
      employeeId:Employee!==""?Employee:employee._id,
      from: selectedFromDate,
      to: selectedToDate,
     // gatePassTime: currentTime,
      //gatePassDate: formattedDateTime,
      message: reason,
    };
    console.log(applicationData)


    // Log the data
    console.log('Application Data:', applicationData);

    // Start the loading state
    setIsLoading(true);
    
    // Make the API call
    fetch(`${BASE_URL}/leave`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(applicationData),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          // Display success message
          Snackbar.show({
            text: 'Appiled SucessFully',
            backgroundColor:"green",
            duration: Snackbar.LENGTH_SHORT,
          });
          // Resetting the form
          setSelectedOption("");
          setSelectedFromDate('');
          setSelectedToDate('');
          setReason('');
          setToggle(false)
          setEmployee("")
          setSearchText("")
          getEmployee()
        } else {
          Snackbar.show({
            text: data.message,
            backgroundColor:"red",
            duration: Snackbar.LENGTH_SHORT,
          });
          
        }
      })
      .catch(error => {
        alert('Error:', error);
      })
      .finally(() => {
        // Stop the loading state
        setIsLoading(false);
      });
    }
     }
     else{
      if(selectedate==="" || selectetime==="" || reason===""){
        Snackbar.show({
          text: 'Please fill all field',
          backgroundColor:"red",
          duration: Snackbar.LENGTH_SHORT,
        });
  
      }
      else if(toggle && Employee===""){
        Snackbar.show({
          text: 'Please select employee',
          backgroundColor:"red",
          duration: Snackbar.LENGTH_SHORT,
        });
      }
      else{
        console.log(Employee)
      const applicationData = {
        
        employeeId:Employee!==""?Employee:employee._id,
       
       gatePassTime: selectetime,
      gatePassDate: selectedate,
        message: reason,
      };
      console.log(applicationData)
  
  
      // Log the data
      console.log('Application Data:', applicationData);
  
      // Start the loading state
      setIsLoading(true);
      
      // Make the API call
      fetch(`${BASE_URL}/leave`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationData),
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            // Display success message
            Snackbar.show({
              text: 'Appiled SucessFully',
              backgroundColor:"green",
              duration: Snackbar.LENGTH_SHORT,
            });
            // Resetting the form
            setSelectedOption("");
            setSelectedTime("")
            setSelectedDate("")
            setReason('');
            setToggle(false)
            setEmployee("")
            setSearchText("")
            getEmployee()
          } else {
            Snackbar.show({
              text: data.message,
              backgroundColor:"red",
              duration: Snackbar.LENGTH_SHORT,
            });
            
          }
        })
        .catch(error => {
          alert('Error:', error);
        })
        .finally(() => {
          // Stop the loading state
          setIsLoading(false);
        });
      }

     }

  };
  useEffect(()=>{
    getEmployee()
  },[searchText])
  
  const showFromDatePicker = () => {
    setDatePickerVisibility('fromDate');
  };

  const showToDatePicker = () => {
    setDatePickerVisibility('toDate');
  };
  const showDatePicker = () => {
    setDatePickerVisibility('Date');
  };
  const showTimePicker = () => {
    setTimePickerVisibility("Time");
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };
  const handleToggle=()=>{
    if(toggle){
      setSearchText("")
      setEmployee("")
    }
    setToggle(!toggle)
  }
  const filter=(data)=>{
    const filteredData = data.filter(item => {
      const name = item.name.toLowerCase(); 
      const searchQuery = searchText.toLowerCase();
    
      return name.includes(searchQuery); 
    });
    return filteredData

  }
  const getEmployee=()=>{
    axios.get(`${BASE_URL}/employee/`).then(res=>{
      //console.log("Employee",res.data)
      setEmployeeList(filter(res.data.employees))
     
      
      //setEmployeeList(filteredData);
    }).catch((error)=>{
      console.log(error)
    })
  }
  const handleSearch=(text)=>{
    setSearchText(text)
   setShowEmployeeList(true)

  }
  

  const handleSearchInputFocus = () => {
    
    setShowEmployeeList(true);
  };

  const handleEmployeeSelect = (employee) => {
    setSearchText(employee.name);
    setEmployee(employee._id)
    //console.log(employee._id)
    setShowEmployeeList(false);
  };
  const handleConfirm = date => {
    //console.warn('A date has been picked: ', date);
    //console.log(isDatePickerVisible)
    const dt = new Date(date);
    dt.setDate(dt.getDate()); // Increment the date by 1 day
    const day = String(dt.getDate()).padStart(2, '0');
    const month = String(dt.getMonth() + 1).padStart(2, '0');
    const year = dt.getFullYear();
    const formattedDate = year + '-' + month + '-' + day;
    console.log(isDatePickerVisible)

    if (isDatePickerVisible === 'fromDate') {
      setSelectedFromDate(formattedDate);
      //console.log("Hii")
    } else if (isDatePickerVisible === 'toDate') {
      setSelectedToDate(formattedDate);
      //console.log("Hii")
    }
    else if(isDatePickerVisible==='Date'){
      //console.log("Hii")
      setSelectedDate(formattedDate)
    }

    //alert(formattedDate);
    hideDatePicker();
  };
  const handleConfirmTime = time => {
    //console.warn('A time has been picked: ', time);
    const date = new Date(time);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  //console.log(minutes)

  const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const amPm = hours >= 12 ? "PM" : "AM";
  const Time=formattedHours+":"+formattedMinutes+" "+amPm
  console.log(Time)

  setSelectedTime(Time);
  console.log(selectetime)
    hideTimePicker()
    
  };


  return (
    <View>
      <Navbar/>
    <ScrollView contentContainerStyle={styles.container}>
     
      <View
        style={{
          marginTop: 12,
          justifyContent: 'center',
          alignItems: 'flex-start',
          marginLeft: 17,
         
        }}
      >
        <Text
          style={{
            fontFamily: 'Inter',
            fontSize: 18,
            fontWeight: '700',
            color: 'black',
          }}
        >
          Apply for a Leave/Gatepass
        </Text>
      </View>
      <View style={styles.formContainer}>
      
        <View style={styles.formGroup}>
          <Text style={styles.label}>Application Type:</Text>
          <View style={styles.dropdown}>
            <Picker
              style={[styles.picker,{marginBottom:"4%"}]}
              selectedValue={selectedOption}
              onValueChange={itemValue => setSelectedOption(itemValue)}
            >
              <Picker.Item label="Choose:" value="" />
              <Picker.Item label="Leave" value="Leave" />
              <Picker.Item label="Gatepass" value="Gatepass" />
            </Picker>
          </View>
        </View>
        {selectedOption!==""&&
        <>
        <View style={{flex:1,flexDirection:"row",marginStart:20}}>
          <ToggleSwitch
  isOn={toggle}
  onColor="#598fc9"
  offColor="#B0B0B0"
  label="Apply for an Employee"
  labelStyle={{ color: "black", fontWeight: "900" }}
  size="small"
  onToggle={handleToggle}
/>

        </View>
       
        <View style={styles.formGroup}>
       
          <View>
            
            <TouchableOpacity style={styles.button}  onPress={toggle?handleSearchInputFocus:null} >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              color:"#DEDEDE"
            }}
          >
             <TextInput
              style={{
                color: 'black',
                fontSize: 15,
                fontWeight: '300',
                marginRight: 10,
              }}
              placeholder="Enter Employee Name"
              onChangeText={text=>handleSearch(text)}
              value={searchText}
              editable={toggle}
             
             
            
            />
            <Feather size={15} color={'#283093'} name="search" />
          </View>
        </TouchableOpacity>
            
          </View>
          
        </View>
        <Modal
        animationType="slide"
        visible={showEmployeeList}
        onRequestClose={() => setShowEmployeeList(false)}
      >
         <View style={styles.formGroup}>
       
       <View>
         
         <TouchableOpacity style={styles.button} >
       <View
         style={{
           flexDirection: 'row',
           alignItems: 'center',
           justifyContent: 'space-between',
           color:"#DEDEDE"
         }}
       >
          <TextInput
           style={{
             color: 'black',
             fontSize: 15,
             fontWeight: '300',
             marginRight: 10,
           }}
           placeholder="Enter Employee Name"
           onChangeText={text=>setSearchText(text)}
           value={searchText}
           editable={toggle}
           
          
         />
         <Feather size={15} color={'#283093'} name="search" />
       </View>
     </TouchableOpacity>
         
       </View>
       
     </View>
        <View style={styles.modalContainer}>
        {EmployeeList.length>0? ( <FlatList
            data={EmployeeList}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.employeeListItem}
                onPress={() => handleEmployeeSelect(item)}
              >
                <View style={{flex:1,flexDirection:"row"}}>
                {item.profilePicture ? <Image
                    source={{
                      uri:
                       item.profilePicture,
                    }}
                    style={styles.photo}
                  /> : <Image
                    source={{
                      uri:
                        'https://avatars.githubusercontent.com/u/94738352?v=4',
                    }}
                    style={styles.photo}
                  />}
                  <View style={{flex:1,flexDirection:"row"}}>
                <Text style={[styles.employeeListItemText,{fontWeight:"bold"}]}>{item.name}</Text>
                {/*<Text style={[styles.employeeListItemText,{marginTop:"2%"}]}>{item.jobProfile.jobProfile}</Text>
                */}
                </View>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
          />):(
            <View style={{flex:1,alignContent:"center",justifyContent:"center"}}>
              <Text>No employee find with this name</Text>
              </View>
          )}
        </View>
      </Modal>
      </>}
       {selectedOption==="Leave" &&<>
        <View style={styles.formGroup}>
          <Text style={styles.label}>From Date:</Text>
          <View>
            {/* <Button title="Select From Date" onPress={showFromDatePicker} /> */}
            <TouchableOpacity style={styles.button} onPress={showFromDatePicker}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            {selectedFromDate === ''?(
            <Text
              style={{
                // color: '#FBFBFC',
                color:'black',
                fontSize: 15,
                fontWeight: '300',
                marginRight: 10,
              
              }}
            >
             Select From Date
            </Text>):(<Text
              style={{
                // color: '#FBFBFC',
                color:'black',
                fontSize: 15,
                fontWeight: '300',
                marginRight: 10,
              
              }}
            >
            {selectedFromDate}
            </Text>)}

            <Feather size={15} color={'#283093'} name="calendar" />
          </View>
        </TouchableOpacity>
            <DateTimePicker
              isVisible={isDatePickerVisible === 'fromDate'}
              mode="date"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
            />
          </View>
          
          
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>To Date:</Text>
          <View>
            <TouchableOpacity style={styles.button} onPress={showToDatePicker}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            {selectedToDate === ''?(
            <Text
              style={{
                // color: '#FBFBFC',
                color:'black',
                fontSize: 15,
                fontWeight: '300',
                marginRight: 10,
              
              }}
            >
             Select From Date
            </Text>):(<Text
              style={{
                // color: '#FBFBFC',
                color:'black',
                fontSize: 15,
                fontWeight: '300',
                marginRight: 10,
              
              }}
            >
            {selectedToDate}
            </Text>)}
            <Feather size={17} color={'#283093'} name="calendar" />
          </View>
        </TouchableOpacity>
            <DateTimePicker
              isVisible={isDatePickerVisible === 'toDate'}
              mode="date"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
            />
          </View>
          
        </View>
        </>}
        {selectedOption==="Gatepass" &&<>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Date:</Text>
          <View>
            {/* <Button title="Select From Date" onPress={showFromDatePicker} /> */}
            <TouchableOpacity style={styles.button} onPress={showDatePicker}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            {selectedate === ''?(
            <Text
              style={{
                // color: '#FBFBFC',
                color:'black',
                fontSize: 15,
                fontWeight: '300',
                marginRight: 10,
              
              }}
            >
             Select Date
            </Text>):(<Text
              style={{
                // color: '#FBFBFC',
                color:'black',
                fontSize: 15,
                fontWeight: '300',
                marginRight: 10,
              
              }}
            >
            {selectedate}
            </Text>)}

            <Feather size={15} color={'#283093'} name="calendar" />
          </View>
        </TouchableOpacity>
            <DateTimePicker
              isVisible={isDatePickerVisible === 'Date'}
              mode="date"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
            />
          </View>
          
          
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Time:</Text>
          <View>
            <TouchableOpacity style={styles.button} onPress={showTimePicker}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            {selectetime === ''?(
            <Text
              style={{
                // color: '#FBFBFC',
                color:'black',
                fontSize: 15,
                fontWeight: '300',
                marginRight: 10,
              
              }}
            >
             Select Time
            </Text>):(<Text
              style={{
                // color: '#FBFBFC',
                color:'black',
                fontSize: 15,
                fontWeight: '300',
                marginRight: 10,
              
              }}
            >
            {selectetime}
            </Text>)}
            <Feather size={17} color={'#283093'} name="watch" />
          </View>
        </TouchableOpacity>
            <DateTimePicker
              isVisible={isTimePickerVisible === 'Time'}
              mode="time"
              onConfirm={handleConfirmTime}
              onCancel={hideTimePicker}
            />
          </View>
          
        </View>
        </>}
        {selectedOption!==""&&

        <View style={styles.formGroup}>
          <Text style={styles.label}>Reason:</Text>
          <TextInput
            style={styles.reasonInput}
            multiline
            maxLength={250}
            value={reason}
            onChangeText={setReason}
          />
        </View> }

        <TouchableOpacity style={styles.Ftext} onPress={handleApply}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom:"10%"
            }}
          >
            <Text
              style={{
                color: '#FBFBFC',
                fontSize: 16,
                fontWeight: '500',
                marginRight: 2,
              }}
            >
              Apply
            </Text>
            <Feather size={17} color={'#FAFAFA'} name="chevrons-up" />
          </View>
        </TouchableOpacity>

        {/* Display activity loader if loading state is true */}
        {isLoading && <ActivityIndicator size="large" color="#007AFF" />}
      </View>
    </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 16,
    marginBottom:"10%"
  },
  formContainer: {
    flex: 1,
  },
  formGroup: {
    margin: 20,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#DEDEDE',
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',

    padding:"2%",
  },
  picker: {
    height: 40,
    width: '100%',
    
    justifyContent:"center"
    
  },
  selectedDate: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  reasonInput: {
    borderWidth: 0.5,
    borderColor: '#DEDEDE',
    borderRadius: 5,
    padding: 10,
    height: 100,
    backgroundColor: '#f5f5f5',
  },
  label: {
    fontWeight: '400',
    marginBottom: 5,
    fontSize: 12,
    color: 'black',
  },
  button: {
    // backgroundColor: '#283093',
    color: 'black',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 0.1,
    borderWidth:1,
    borderColor:"#DEDEDE"
    // alignSelf: 'flex-end',
  },
  Ftext: {
    width: 104,
    height: 40,
    color: '#283093',
    fontSize: 16,
    fontWeight: '500',
    backgroundColor: '#283093',
    paddingHorizontal: 20,
    // paddingVertical: 15,
    borderRadius: 7,
    // marginRight:24,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    marginLeft: 30,
    marginBottom:"40%"
  },
  modalContainer: {
   
    bottom: 0,
    width: '100%',
    height: "100%",// Adjust the height as needed
    backgroundColor: '#fff',
  },
  employeeListItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  employeeListItemText: {
    fontSize: 16,
    color: '#333',
  },
  photo: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  
});

export default LeaveApplication;
