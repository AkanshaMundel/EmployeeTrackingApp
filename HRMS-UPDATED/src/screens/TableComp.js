import {
  View,
  ScrollView,
  StyleSheet,
  TextInput,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {Picker} from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import TableIcon from 'react-native-vector-icons/Entypo';
import Navbar from './Navbar';
import axios from 'axios';
import {BASE_URL} from '../ConfigLinks';
import {Table, Row, TableWrapper} from 'react-native-table-component';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MyAttendance from './MyAttendance';

const TableComp = () => {
  const [selectedOption, setSelectedOption] = useState('Staff attendance');
  const [selectedOptions2, setSelectedOptions2] = useState('Job Profile');
  const [searchQuery, setSearchQuery] = useState('');
  const [jobProfiles, setJobProfiles] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [data, setData] = useState([]);
  const widthArr = [150, 150, 150, 150, 150, 160];
  const [refreshing, setRefreshing] = useState(false);
  const [showEmployeePuches, setShowEmployeePunches] = useState(false);
  const [employeeData, setEmployeeData] = useState([]);
  const [expandedRows, setExpandedRows] = useState([]);
  const widthArr2 = [150, 150, 150, 150];

  const [tableHead, setTableHead] = useState([
    'Date',
    'Name',
    'Punch-in',
    'Punch-out',
    'Status',
    'Marked by',
  ]);

  useEffect(() => {
    fetchData();
    fetchJobProfile();
  }, [searchQuery, selectedOptions2, selectedDate, expandedRows]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData(); // Call the fetchData function again to refresh the data
    setRefreshing(false);
  };
  const handleEmployeePunch = async name => {
    console.log(name);

    try {
      const datePart = selectedDate.toISOString().split('T')[0];
      console.log(datePart);
      const res = await axios.get(
        `${BASE_URL}/attendance?name=${name}&date=${datePart}`,
      );

      const parsedData = res?.data;
      //console.log('apidata', parsedData);
      if (parsedData.success && parsedData.attendanceRecords) {
        const userData = parsedData.attendanceRecords[0].punches;

        console.log('data', userData.length);

        const mappedData = userData.map(item => {
          // console.log('item111234', item);
          const punchInTime = item.punchIn
            ? new Date(item.punchIn).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              })
            : 'N/A';
          const punchOutTime = item?.punchOut
            ? new Date(item.punchOut).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              })
            : 'Null';
          const approvedByValue = item?.approvedBy?.name
            ? item?.approvedBy.name
            : item.rejectedBy?.name
            ? item.rejectedBy.name
            : 'Need Action';

          return {
            punchIn: punchInTime,
            PunchOut: punchOutTime,
            status: checkStatus(
              item.status,
              parsedData.attendanceRecords[0].employeeId._id,
              item.punchIn,
              parsedData.attendanceRecords[0].date,
            ),

            ApprovedBy: approvedByValue,
            id: parsedData.attendanceRecords[0].employeeId._id,
            originalPunchIn: item.punchIn,
            date: parsedData.attendanceRecords[0].date,
          };
        });
        //updatedData=mappedData.shift()
        //console.log(updatedData.length)
        // Remove the first object from the array
        mappedData.reverse();
        mappedData.splice(0, 1);

        console.log(mappedData);

        setEmployeeData(mappedData);
        //fetchData()
        //console.log('renderData', mappedData); // console the
        setRefreshing(false);
        //setIsLogin(true);
        //alert('Attendance data fetched successfully');
      } else {
        console.log('Invalid data format:', parsedData);
        setRefreshing(false);
      }
    } catch (err) {
      console.log('appi err in table', err);
      setRefreshing(false);
    }
  };
  const handleRowPress = (index, name) => {
    if (expandedRows.includes(index)) {
      setExpandedRows(expandedRows.filter(row => row !== index));
      setExpandedRows([]);
    } else {
      setExpandedRows([index]);
      handleEmployeePunch(name);
    }
  };
  const handlePrevDate = () => {
    const prevDate = new Date(selectedDate);
    prevDate.setDate(prevDate.getDate() - 1);
    setSelectedDate(prevDate);
  };
  console.log('Date', selectedDate);

  const handleNextDate = () => {
    const nextDate = new Date(selectedDate);
    nextDate.setDate(nextDate.getDate() + 1);
    setSelectedDate(nextDate);
  };
  const handleRejectStatusClick = (Id, punchIn, date) => {
    Alert.alert(
      'Select Action',
      'Choose an action for the change status of employee',
      [
        {
          text: 'Approved',
          onPress: () => handleApproved(Id, punchIn, date),
        },
        {text: 'Cancel', style: 'cancel'},
      ],
    );
  };
  const handlePendingStatusClick = (Id, punchIn, date) => {
    Alert.alert(
      'Select Action',
      'Choose an action for the change status of employee',
      [
        {
          text: 'Approved',
          onPress: () => handleApproved(Id, punchIn, date),
        },
        {
          text: 'Reject',
          onPress: () => handleReject(Id, punchIn, date),
        },
        {text: 'Cancel', style: 'cancel'},
      ],
    );
  };
  const handleApprovedStatusClick = (Id, punchIn, date) => {
    Alert.alert(
      'Select Action',
      'Choose an action for the change status of employee',
      [
        {
          text: 'Reject',
          onPress: () => handleReject(Id, punchIn, date),
        },
        {text: 'Cancel', style: 'cancel'},
      ],
    );
  };
  const handleReject = (Id, punchIn, date) => {
    console.log(Id, punchIn, date);
    setRefreshing(true);

    axios
      .patch(`${BASE_URL}/attendance/updateAttendance`, {
        employeeId: Id,
        status: 'reject',
        punchInTime: punchIn,
        date: date,
      })
      .then(res => {
        setRefreshing(false);
        fetchData();
        setShowEmployeePunches(false);
        //handleEmployeePunch(employeePunch)
      })
      .catch(err => {
        setIsLoading(false);
        setRefreshing(false);
        //Alert.alert(err)
      });
  };
  const handleApproved = (Id, punchIn, date) => {
    console.log(Id, punchIn, date);
    setRefreshing(true);
    axios
      .patch(`${BASE_URL}/attendance/updateAttendance`, {
        employeeId: Id,
        status: 'approved',
        punchInTime: punchIn,
        date: date,
      })
      .then(res => {
        setRefreshing(false);
        //Alert.alert("Status Update Sucessfully")
        //setRefreshing(true)
        setShowEmployeePunches(false);
        fetchData();
        //handleEmployeePunch(employeePunch)
      })
      .catch(err => {
        setRefreshing(false);
        console.log(err);
        //Alert.alert(err)
      });
  };
  const checkStatus = (status, id, originalPunchIn, date) => {
    console.log('status', originalPunchIn);
    let res;
    if (status === 'pending') {
      res = (
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: '#FEF5ED',
            borderRadius: 15,
            padding: 6,
            justifyContent: 'center',
          }}
        >
          <Feather
            name="loader"
            color={'#945D2D'}
            size={15}
            style={{marginRight: 6}}
          />
          <Text
            style={{
              fontSize: 12,
              color: '#945D2D',
            }}
          >
            Pending
          </Text>
          <MaterialCommunityIcons
            name="dots-vertical" // Using the three-point menu icon
            color={'#945D2D'}
            size={15}
            style={{marginLeft: '4%'}}
            onPress={() => handlePendingStatusClick(id, originalPunchIn, date)}
          />
        </View>
      );
    } else if (status === 'rejected') {
      res = (
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: '#FCECEC',
            borderRadius: 15,
            padding: 6,
            justifyContent: 'center',
          }}
        >
          <Feather
            name="x"
            color={'#8A2626'}
            size={15}
            style={{marginRight: 4}}
          />
          <Text
            style={{
              fontSize: 12,
              color: '#8A2626',
            }}
          >
            Rejected
          </Text>
          <MaterialCommunityIcons
            name="dots-vertical" // Using the three-point menu icon
            color={'#8A2626'}
            size={15}
            style={{marginLeft: '4%'}}
            onPress={() => handleRejectStatusClick(id, originalPunchIn, date)}
          />
        </View>
      );
    } else {
      res = (
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: '#E9F7EF',
            borderRadius: 15,
            padding: 6,
            justifyContent: 'center',
          }}
        >
          <Feather
            name="check"
            color={'#186A3B'}
            size={15}
            style={{marginRight: 4}}
          />
          <Text
            style={{
              fontSize: 12,
              color: '#186A3B',
            }}
          >
            Approved
          </Text>
          <MaterialCommunityIcons
            name="dots-vertical" // Using the three-point menu icon
            color={'#186A3B'}
            size={15}
            style={{marginLeft: '4%'}}
            onPress={() => handleApprovedStatusClick(id, originalPunchIn, date)}
          />
        </View>
      );
    }
    return res;
  };
  // JOB PROFILE
  const fetchJobProfile = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/jobProfile`);
      console.log('job profile', res.data.docs);
      setJobProfiles(res.data.docs);
      //console.log(jobProfiles.length)
    } catch (err) {
      console.log(err);
    }
  };
  console.log('selectedDate', selectedDate);
  const datePart = selectedDate.toISOString().split('T')[0];
  console.log('datePart', datePart);

  const formatDate = date => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const fetchData = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/attendance?date=${formatDate(
          selectedDate,
        )}&jobProfileName=${encodeURIComponent(
          selectedOptions2,
        )}&name=${encodeURIComponent(searchQuery)}`,
      );

      const parsedData = res?.data;
      console.log('apidata', parsedData);
      if (parsedData.success && parsedData.attendanceRecords) {
        const userData = parsedData.attendanceRecords;

        const mappedData = userData.map((item, index) => {
          //console.log('item111234', item);
          let len = item.punches.length;
          //console.log("data",item.punches[len - 1])

          const punchInTime = item.punches[len - 1]?.punchIn
            ? new Date(item.punches[len - 1].punchIn).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              })
            : 'N/A';
          const punchOutTime = item.punches[len - 1]?.punchOut
            ? new Date(item.punches[len - 1].punchOut).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              })
            : 'Null';
          const approvedByValue = item.punches[len - 1]?.approvedBy?.name
            ? item.punches[len - 1]?.approvedBy.name
            : item.punches[len - 1]?.rejectedBy?.name
            ? item.punches[len - 1].rejectedBy.name
            : 'Need Action';

          return {
            Date: new Date(item.date).toLocaleDateString('en-GB', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            }),
            Name: (
              <TouchableOpacity
                style={{flexDirection: 'row'}}
                onPress={() => handleRowPress(index, item.employeeId.name)}
              >
                <Text> {item.employeeId.name} </Text>
                {len > 1 ? (
                  <TableIcon
                    color="black"
                    name={
                      expandedRows.includes(index)
                        ? 'chevron-small-up'
                        : 'chevron-small-down'
                    }
                    size={20}
                  />
                ) : null}
              </TouchableOpacity>
            ),
            punchIn: punchInTime,
            PunchOut: punchOutTime,
            status: checkStatus(
              item.punches[len - 1].status,
              item.employeeId._id,
              item.punches[len - 1].punchIn,
              item.date,
            ),
            ApprovedBy: approvedByValue,
            id: item.employeeId._id,
            originalPunchIn: item.punches[len - 1].punchIn,
            date: item.date,
          };
        });

        setData(mappedData);
        console.log('renderData', mappedData); // console the

        setRefreshing(false);
        setIsLogin(true);
        //alert('Attendance data fetched successfully');
      } else {
        console.log('Invalid data format:', parsedData);
        setRefreshing(false);
      }
    } catch (err) {
      console.log('appi err in table', err);
      setRefreshing(false);
    }
  };

  return (
    <View style={styles.container}>
      <Navbar />
      <View
        style={{
          padding: '2%',
          flex: 1,
          maxHeight: Dimensions.get('window').height * 0.9,
        }}
      >
        <View style={{marginLeft: '2%', marginTop: '2%'}}>
          <Text style={{fontSize: 25, fontWeight: '700', color: 'black'}}>
            Attendance Database
          </Text>
        </View>
        <View style={{flexDirection: 'column'}}>
          <View style={{padding: '5%', marginBottom: '8%'}}>
            <Picker
              style={{
                width: '80%',
                height: '2%',
                // height: 40,
                // paddingBottom: '2%',
                backgroundColor: '#ECEDFE',
                color: '#283093',
              }}
              selectedValue={selectedOption}
              onValueChange={itemValue => setSelectedOption(itemValue)}
            >
              <Picker.Item label="Staff attendance" value="Staff attendance" />
              <Picker.Item label="Your attendance" value="Your attendance" />
            </Picker>
          </View>
          {selectedOption == 'Staff attendance' ? (
            <View
              style={{
                flexDirection: 'row',
                marginTop: '3%',
              }}
            >
              <View
                style={{
                  width: '50%',
                  marginLeft: '5%',
                  borderColor: '#DEDEDE',
                  borderRadius: 3,
                  borderWidth: 1,
                  // borderRightWidth: 2.5,
                }}
              >
                <Picker
                  style={{
                    width: '100%',
                    // height: '15%',
                    backgroundColor: 'white',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    color: 'black',
                  }}
                  selectedValue={selectedOptions2}
                  onValueChange={itemValue => setSelectedOptions2(itemValue)}
                  itemStyle={{color: 'black', fontSize: 10}}
                >
                  <Picker.Item label="Job Profile" value="Job Profile" />
                  {jobProfiles.map((item, index) => (
                    <Picker.Item
                      label={item.jobProfileName}
                      value={item.jobProfileName}
                    />
                  ))}
                </Picker>
              </View>
              <View style={styles.searchBarContainer}>
                <Icon name="search" style={styles.searchIcon} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search..."
                  onChangeText={text => setSearchQuery(text)} //updating on chngin name
                  value={searchQuery}
                  placeholderTextColor="gray"
                />
              </View>
            </View>
          ) : (
            <Text>{''}</Text>
          )}
        </View>
        {selectedOption == 'Staff attendance' ? (
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
              />
            }
          >
            <ScrollView
              horizontal={true}
              contentContainerStyle={{minHeight: 900}}
            >
              <Text>{''}</Text>

              <View style={styles.dataWrapper}>
                <Table>
                  <Row
                    data={tableHead}
                    widthArr={widthArr}
                    style={styles.header}
                    textStyle={styles.text}
                  />
                  {data.map((rowData, index) => (
                    <React.Fragment key={index}>
                      <Row
                        key={index}
                        data={Object.values(rowData)}
                        widthArr={widthArr}
                        style={[{backgroundColor: 'white', height: 50}]}
                        textStyle={styles.Bodytext}
                      />
                      {expandedRows.includes(index) && (
                        <TableWrapper style={{flex: 1, marginLeft: 300}}>
                          {employeeData.map((nestedRow, nestedIndex) => (
                            <Row
                              key={nestedIndex}
                              data={Object.values(nestedRow)}
                              widthArr={widthArr2}
                              style={[{backgroundColor: 'white', height: 50}]}
                              textStyle={styles.Bodytext}
                            />
                          ))}
                        </TableWrapper>
                      )}
                    </React.Fragment>
                  ))}
                </Table>
              </View>
            </ScrollView>
          </ScrollView>
        ) : (
          <MyAttendance date={selectedDate} />
        )}

        <View style={styles.dateFilterContainer}>
          <TouchableOpacity onPress={handlePrevDate}>
            <Icon name="arrow-left" size={20} color="black" />
          </TouchableOpacity>
          <Text style={styles.dateText}>{selectedDate.toDateString()}</Text>
          <TouchableOpacity onPress={handleNextDate}>
            <Icon name="arrow-right" size={20} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default TableComp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    // maxHeight: Dimensions.get('window').height * 0.5,
  },
  searchBarContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 10,
    // marginBottom: '2%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40%',
    // marginTop: 10,
    borderWidth: 1,
    borderColor: '#DEDEDE',
    // marginRight: '10%',
    marginLeft: '4%',
    //height:"10%"
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 10,
    color: '#333',
  },
  searchInput: {
    fontSize: 16,
    height: 40,
    flex: 1,
  },
  dateFilterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '2%',
    borderColor: '#283093',
    borderWidth: 1,
    borderRadius: 10, // Adjust the border radius as needed
    paddingHorizontal: 12,
    paddingVertical: '2.5%',
    maxWidth: 200,
    marginLeft: '25%',
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 10,
    color: '#283093',
  },
  dataWrapper: {
    // borderRadius: 8,
    // padding: '5%',
  },
  text: {
    fontSize: 16,
    color: 'black',
    fontWeight: '500',
    // padding: 5,
    textAlign: 'left',
    fontFamily: 'Inter',
    marginLeft: '10%',
  },
  Bodytext: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'left',
    marginLeft: '10%',
    // padding: '2%',
    // flexWrap: 'wrap',
  },
  header: {
    backgroundColor: '#ECEDFE',
    paddingVertical: 10,
  },
});
