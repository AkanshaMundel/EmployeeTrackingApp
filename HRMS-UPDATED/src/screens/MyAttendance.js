import React, {useState, useEffect} from 'react';

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
} from 'react-native';

import axios from 'axios';
import Feather from 'react-native-vector-icons/Feather';
import {BASE_URL} from '../ConfigLinks';

const MyAttendance = ({date}) => {
  console.log('datepss', date);
  const datePart = date.toISOString().split('T')[0];
  const [isLoading, setIsLoading] = useState(false);

  const [refreshing, setRefreshing] = useState(false);

  const [columns, setColumns] = useState([
    'Date',

    'Punch-in',

    'Punch-out',

    'status',

    'Approve/Rejected',
  ]);

  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, [datePart]);
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
  const handleRefresh = () => {
    setRefreshing(true);
    fetchData(); // Call the fetchData function again to refresh the data
    setRefreshing(false);
  };

  const fetchData = async () => {
    ///console.warn('click happened');
    setRefreshing(true);
    setData([]);
    try {
      const res = await axios.get(
        `${BASE_URL}/attendance/myAttendance?date=${encodeURIComponent(
          datePart,
        )}/`,
      );

      console.log(res);

      const parsedData = res?.data;

      console.log('apidatamyAt', parsedData);

      if (parsedData.success && parsedData.data) {
        const userData = parsedData.data[0].punches;

        //console.log(parsedData)

        console.log('\nUserData', userData);
        if (userData.length === 0) {
          setData([]);
        } else {
          const mappedData = userData.map(item => {
            // console.log('item111234', item);

            const formatTime = time => {
              return item.punchIn
                ? new Date(item.punchIn).toLocaleTimeString([], {
                    hour: '2-digit',

                    minute: '2-digit',

                    hour12: true,
                  })
                : 'N/A';
            };

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
              Date: new Date(parsedData.data[0].date).toLocaleDateString(
                'en-GB',
                {
                  year: 'numeric',

                  month: '2-digit',

                  day: '2-digit',
                },
              ),

              punchIn: punchInTime,

              PunchOut: punchOutTime,

              status: item.status,

              Type: 'Pending',

              ApprovedBy: approvedByValue,
            };
          });

          setData(mappedData);

          console.log('renderData', mappedData); // console the

          setFilteredData(mappedData);

          setIsLogin(true);
          setRefreshing(false);
        }

        //alert('MyAttendance data fetched successfully');
      } else {
        console.log('Invalid data format:', parsedData);
        setRefreshing(false);
      }
    } catch (err) {
      console.log(`API Error: ${err}`);
      setRefreshing(false);
    }
  };

  const tableHeader = () => (
    <View style={styles.header}>
      <ScrollView horizontal={true}>
        {columns.map((column, index) => (
          <Text style={styles.text} key={index}>
            {column}
          </Text>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <ScrollView horizontal>
      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        ListHeaderComponent={tableHeader}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        renderItem={({item, index}) => (
          //console.log('overwrite',item),

          <View style={styles.tableRow}>
            <Text style={styles.columnRowTxt}>{item.Date}</Text>

            <Text style={styles.columnRowTxt}>{item.punchIn}</Text>

            <Text style={styles.columnRowTxt}>{item.PunchOut}</Text>

            <Text style={styles.columnRowTxt}>{checkStatus(item.status)}</Text>

            <Text style={styles.columnRowTxt}>{item.ApprovedBy}</Text>
          </View>
        )}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 16,

    color: 'black',

    fontWeight: '500',

    // padding: 10,

    paddingHorizontal: 20, // Reduce the padding for better fitting in table cells
    paddingHorizontal: 25,

    textAlign: 'center', // Center the text within each cell

    fontFamily: 'Inter',

    fontWeight: 'bold',
  },

  Bodytext: {
    fontFamily: 'Inter',

    fontSize: 14,

    fontWeight: '400',

    textAlign: 'center',

    padding: 6,
  },

  header: {
    backgroundColor: '#ECEDFE',

    paddingVertical: 15,

    marginBottom: 12,

    flexDirection: 'row',

    justifyContent: 'space-evenly',

    alignItems: 'center',

    borderTopEndRadius: 5,

    borderTopStartRadius: 2,
  },

  row: {
    borderBottomColor: 'white',

    borderBottomWidth: 1,
  },

  tableRow: {
    flexDirection: 'row',

    height: 40,

    alignItems: 'center',

    width: '90%', // Set the row width to the screen width

    color: 'black',
  },

  dropdown: {
    backgroundColor: 'white',

    borderWidth: 0.1,

    borderRadius: 10,

    overflow: 'hidden',

    width: '40%', // Set the width to a small value to make the dropdown small

    // height: '50%',

    borderColor: '#F0F0F0',

    elevation: 1,

    justifyContent: 'center',
  },

  picker: {
    height: '10%',

    width: '100%',

    color: '#000',

    // justifyContent:'center',

    // alignItems:'center'

    textAlign: 'center',

    // marginBottom:20

    // flex:1
  },

  columnRowTxt: {
    color: 'black',

    flex: 1, // Set each column to occupy an equal portion of the row

    textAlign: 'center',

    fontSize: 12,

    overflow: 'hidden',
  },

  attendanceContainer: {
    backgroundColor: '#fff',

    height: '90%',
  },

  dateFilterContainer: {
    flexDirection: 'row',

    justifyContent: 'center',

    alignItems: 'center',

    marginTop: 10,

    borderColor: '#283093',

    borderWidth: 1,

    borderRadius: 10, // Adjust the border radius as needed

    paddingHorizontal: 10,

    paddingVertical: '1.5%',

    maxWidth: 200,

    marginLeft: '25%',
  },

  dateText: {
    fontSize: 16,

    fontWeight: 'bold',

    // marginHorizontal: 10,

    color: '#283093',
  },
});

export default MyAttendance;
