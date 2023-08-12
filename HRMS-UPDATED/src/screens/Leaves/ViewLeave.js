import React, {useState, useEffect, useContext} from 'react';
import {View, ScrollView, StyleSheet, TextInput, Text} from 'react-native';
import {Table, Row} from 'react-native-table-component';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import Navbar from '../Navbar';
import {AuthContext} from '../../context/AuthContext';
import {BASE_URL} from '../../ConfigLinks';
import {Picker} from '@react-native-picker/picker';
import Feather from 'react-native-vector-icons/Feather';

const ViewLeave = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const widthArr = [150, 150, 100, 150];
  const widthArrMYL = [150, 100, 150]; //ONLY FOR MY LEAVE
  const [dataLeave, setDataLeave] = useState([]);
  const [dataGatepass, setDataGatepass] = useState([]);
  const [mydataLeave, mysetDataLeave] = useState([]); //your leave
  const [mydataGatepass, mysetDataGatepass] = useState([]); //your gatepasspass

  const {userInfo} = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedOption, setSelectedOption] = useState('Leaves'); //LEAVE GATPSS filter
  const [selectedOptions1, setSelectedOptions1] = useState('Staff Leaves'); // staff and myleave filter
  const [selectedOptions2, setSelectedOptions2] = useState(null); //all job profile

  const [jobProfiles, setJobProfiles] = useState([]);

  const [tableHead, setTableHead] = useState([
    'Name',
    'Time Period',
    'Status',
    'Supervisor',
  ]);
  const [tableHead1, setTableHead1] = useState([
    'GatePass Date',
    'Time Period',
    'Status',
    'Supervisor',
  ]);
  //ONLY FOR MY LEAVE HEADS , NO NAME
  const [tableHeadMYL, setTableHeadMYL] = useState([
    'Time Period',
    'Status',
    'Supervisor',
  ]);

  useEffect(() => {
    fetchData();
    myfetchData(); //for my leave(leave+gaepass)
    fetchJobProfile();
  }, [searchQuery, selectedOptions2]);

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
  //for leave anf gatepass
  const checkStatus = status => {
    let res;
    if (status === 'pending') {
      res = (
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: '#FEF5ED',
            borderRadius: 15,
            padding: 6,
          }}
        >
          <Feather
            name="loader"
            color={'#945D2D'}
            size={15}
            style={{marginRight: 4}}
          />
          <Text
            style={{
              fontSize: 12,
              color: '#945D2D',
            }}
          >
            Pending
          </Text>
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
        </View>
      );
    }
    return res;
  };
  const fetchData = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/leave/all?jobProfileName=${encodeURIComponent(
          selectedOptions2,
        )}&name=${encodeURIComponent(searchQuery)}`,
      );
      const parsedData = res?.data;

      if (parsedData.success && parsedData.allLeaves) {
        const userData = parsedData.allLeaves;

        // Separate the data for Leaves and Gatepass based on the presence of "gatePassDate"
        const leavesData = userData.filter(item => 'from' in item);
        const gatepassData = userData.filter(item => 'gatePassDate' in item);

        const mappedLeavesData = leavesData.map(item => {
          const name = item.employeeId.name;
          const fromDate = new Date(item.from).toLocaleDateString();
          const toDate = new Date(item.to).toLocaleDateString();
          const duration = `${toDate} - ${fromDate}`;
          const status = checkStatus(item.status);

          return {
            Name: name,
            TimePeriod: duration,
            Status: status,
            Supervisor: userInfo.employee.name,
          };
        });

        const mappedGatepassData = gatepassData.map(item => {
          const gatePassDate = new Date(item.gatePassDate).toLocaleDateString();
          const gatePassTime = item.gatePassTime;
          const status = checkStatus(item.status);
          const supervisor = userInfo.employee.name;

          return {
            GatePassDate: gatePassDate,
            TimePeriod: gatePassTime,
            Status: status,
            Supervisor: supervisor,
          };
        });

        setDataLeave(mappedLeavesData);
        setDataGatepass(mappedGatepassData);
        setIsLoading(false);
        setIsLogin(true);
        // alert('Leave successful');
      } else {
        console.log('Invalid data format:', parsedData);
        setIsLoading(false);
      }
    } catch (err) {
      console.log(`API Error: ${err}`);
      setIsLoading(false);
    }
  };

  //for my leave ->(leave and gatepass)
  const myfetchData = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/leave/myleave?jobProfileName=${encodeURIComponent(
          selectedOptions2,
        )}&name=${encodeURIComponent(searchQuery)}`,
      );
      const parsedData = res?.data;

      if (parsedData.success && parsedData.leaves) {
        const userData = parsedData.leaves;
        console.log('myleave apidata', userData);
        //for supervisor
        const supervisorData = parsedData.upperLevelEmployee?.name ?? 'null';

        // Separate the data for Leaves and Gatepass based on the presence of "gatePassDate"
        const leavesData = userData.filter(item => 'from' in item);
        const gatepassData = userData.filter(item => 'gatePassDate' in item);

        const mymappedLeavesData = leavesData.map(item => {
          // const name = item.employeeId.name;
          const fromDate = new Date(item.from).toLocaleDateString();
          const toDate = new Date(item.to).toLocaleDateString();
          const duration = `${toDate} - ${fromDate}`;
          const status = checkStatus(item.status);

          return {
            // Name: name,
            TimePeriod: duration,
            Status: status,
            Supervisor: supervisorData,
          };
        });

        const mymappedGatepassData = gatepassData.map(item => {
          const gatePassDate = new Date(item.gatePassDate).toLocaleDateString();
          const gatePassTime = item.gatePassTime;
          const status = checkStatus(item.status);

          return {
            GatePassDate: gatePassDate,
            TimePeriod: gatePassTime,
            Status: status,
            Supervisor: supervisorData,
          };
        });

        mysetDataLeave(mymappedLeavesData);
        mysetDataGatepass(mymappedGatepassData);
        console.log('leaveData My', mymappedLeavesData),
          console.log('gatepassData my', mymappedGatepassData);
        setIsLoading(false);
        setIsLogin(true);
        // alert('Leave successful');
      } else {
        console.log('Invalid data format:', parsedData);
        setIsLoading(false);
      }
    } catch (err) {
      console.log(`API Error: ${err}`);
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Navbar />

      <View
        style={{
          paddingVertical: 5,
          flexDirection: 'row',
        }}
      >
        <View
          style={{
            width: '40%',
            justifyContent: 'center',
            alignContent: 'center',
            marginLeft: '5%',
          }}
        >
          <Text style={{fontSize: 20, fontWeight: '700', color: 'black'}}>
            View Database
          </Text>
        </View>
        <View
          style={{
            backgroundColor: '#ECEDFE',
            borderWidth: 0,
            borderRadius: 5,
            overflow: 'hidden',
            width: '40%',
          }}
        >
          <Picker
            style={{
              width: '90%',
              height: '7%',
              // paddingBottom: '2%',
              backgroundColor: '#ECEDFE',
              color: '#283093',
            }}
            selectedValue={selectedOption}
            onValueChange={itemValue => setSelectedOption(itemValue)}
            itemStyle={{color: '#283093'}}
          >
            <Picker.Item
              style={{color: '#283093'}}
              label="Leaves"
              value="Leaves"
            />
            <Picker.Item
              style={{color: '#283093'}}
              label="Gatepass"
              value="Gatepass"
            />
          </Picker>
        </View>
      </View>

      <View
        style={{
          flexDirection: 'row',
          marginLeft: 12,
          marginTop: 10,
          // alignItems: 'center',
          // justifyContent: 'center',
          // justifyContent: 'flex-start',
        }}
      >
        <View
          style={{
            width: '45%',
            borderRadius: 3,
            borderWidth: 1.5,
            borderRightWidth: 2.5,
            // borderLeftWidth: 2,
            borderColor: '#DEDEDE',
            marginRight: 12,
          }}
        >
          <Picker
            style={{
              width: '100%',
              // height: '15%',
              backgroundColor: 'white',
              // backgroundColor: 'yellow',
              // borderRadius: 8,
              // borderWidth: 1,

              textAlign: 'center',
            }}
            selectedValue={selectedOptions1}
            onValueChange={itemValue => setSelectedOptions1(itemValue)}
            itemStyle={{color: '#283093'}}
          >
            <Picker.Item label="Staff Leaves" value="Staff Leaves" />
            <Picker.Item label="Your Leaves" value="Your Leaves" />
          </Picker>
        </View>

        {/* for job profile */}
        <View
          style={{
            width: '45%',
            borderRadius: 3,
            borderWidth: 1.5,

            borderColor: '#DEDEDE',
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
      </View>
      <View style={styles.searchBarContainer}>
        <Icon name="search" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          onChangeText={text => setSearchQuery(text)} //updating on chngin name
          value={searchQuery}
          placeholderTextColor="black"
        />
      </View>
      <ScrollView>
        <ScrollView horizontal={true}>
          {selectedOptions1 === 'Staff Leaves' ? (
            selectedOption === 'Leaves' ? (
              <View style={styles.dataWrapper}>
                <Table>
                  <Row
                    data={tableHead}
                    widthArr={widthArr}
                    style={styles.header}
                    textStyle={styles.text}
                  />
                  {dataLeave.map((rowData, index) => (
                    <Row
                      key={index}
                      data={Object.values(rowData)}
                      widthArr={widthArr}
                      style={[{backgroundColor: 'white'}]}
                      textStyle={styles.Bodytext}
                    />
                  ))}
                </Table>
              </View>
            ) : (
              <View style={styles.dataWrapper}>
                <Table>
                  <Row
                    data={tableHead1}
                    widthArr={widthArr}
                    style={styles.header}
                    textStyle={styles.text}
                  />
                  {dataGatepass.map((rowData, index) => (
                    <Row
                      key={index}
                      data={Object.values(rowData)}
                      widthArr={widthArr}
                      style={[{backgroundColor: 'white'}]}
                      textStyle={styles.Bodytext}
                    />
                  ))}
                </Table>
              </View>
            )
          ) : selectedOption === 'Leaves' ? (
            <View style={styles.dataWrapper}>
              <Table>
                <Row
                  data={tableHeadMYL}
                  widthArr={widthArrMYL}
                  style={styles.header}
                  textStyle={styles.text}
                />
                {mydataLeave.map((rowData, index) => (
                  <Row
                    key={index}
                    data={Object.values(rowData)}
                    widthArr={widthArrMYL}
                    style={[{backgroundColor: 'white'}]}
                    textStyle={styles.Bodytext}
                  />
                ))}
              </Table>
            </View>
          ) : (
            <View style={styles.dataWrapper}>
              <Table>
                <Row
                  data={tableHead1}
                  widthArr={widthArr}
                  style={styles.header}
                  textStyle={styles.text}
                />
                {mydataGatepass.map((rowData, index) => (
                  <Row
                    key={index}
                    data={Object.values(rowData)}
                    widthArr={widthArr}
                    style={[{backgroundColor: 'white'}]}
                    textStyle={styles.Bodytext}
                  />
                ))}
              </Table>
            </View>
          )}
        </ScrollView>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  dataWrapper: {
    borderRadius: 8,
    paddingLeft: '2%',
  },
  text: {
    fontSize: 16,
    color: 'black',
    fontWeight: '500',
    padding: 5,
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
    padding: 6,
    flexWrap: 'wrap',
  },
  header: {
    backgroundColor: '#ECEDFE',
    paddingVertical: 10,
  },
  row: {
    borderBottomColor: '#C1C0B9',
    borderBottomWidth: 1,
  },
  searchBarContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 10,
    marginBottom: '2%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#DEDEDE',
    marginRight: '5%',
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
  dropdown2Style: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
    width: '47%', // Set the width to a small value to make the dropdown small
    height: '60%',
    flexWrap: 'wrap',
    marginLeft: '2%', // Change the marginLeft to align the second dropdown next to the first one
  },
  picker: {
    // height: '15%',
    width: '100%',
    color: '#000',
  },
});

export default ViewLeave;
