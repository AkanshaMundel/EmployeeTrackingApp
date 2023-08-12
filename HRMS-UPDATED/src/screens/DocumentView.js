import { StyleSheet, Text, View ,FlatList,Pressable,ScrollView, TouchableOpacity,Image} from 'react-native'
import React, { useState ,useEffect,useContext} from 'react'
import { AuthContext } from '../context/AuthContext';

import axios from 'axios'
import ContainerImage from '../component/ContainerImage'
import Icon from 'react-native-vector-icons/AntDesign'
import { BASE_URL } from '../ConfigLinks';







  

const DocumentView = ({ navigation: { goBack,navigate } }) => {
  const[documents,setDocuments]=useState([])
  const { userInfo, isLoading, logout } = useContext(AuthContext);
  const { employee } = userInfo;
  const Id = employee ? employee._id: 'null';
  useEffect(() => {
    getDocument();
   },[]);
  
  

  
  const getDocument=()=>{
    axios.get(`${BASE_URL}/employee/docs//getProfile/${Id}`,
       
    ).then(res=>{
      //console.log(res.data);
      setDocuments(res.data.employee.document);
      //console.log(documents)
      }).catch((error)=>{
        console.log(error)
      })

  }

  return (
    <View style={{flex:1}}>
      <View style ={{flexDirection:"row",marginTop:50,gap:15,marginLeft:20}}>
       
      <Icon name="leftcircleo" size={30} color="#000" onPress={()=>goBack()} />
     
      <Text style={{fontSize:20,fontWeight:"700",color:"black"}}>Your Documents</Text>
      </View>
      <FlatList
      numColumns={2}
      data={documents}
      style={styles.grid}
      renderItem={({item, index}) => (
        <View style={styles.card}>
        <View style={{overflow:"hidden",alignItems:"center",position:"relative"}}>
        <TouchableOpacity onPress={()=>navigate("FileView",{link:item.docs})}>
          
         <ContainerImage link={item.docs} />
         </TouchableOpacity>
          
          </View>
          <View style={{marginTop:30}}>
        <View style={styles.DocConatiner}>
          <TouchableOpacity onPress={()=>navigate("FileView",{link:item.docs})}>
          
          <Text style={{color:"#080a80"}}>{item.docsName}</Text>
          </TouchableOpacity>
          </View>
          </View>
          </View>
  
        
      )}
      />
      
    </View>
  )
}

export default DocumentView

const styles = StyleSheet.create({
  
  grid: {
    margin: 12,
    marginBottom:"15%"
  },
  card: {
    height: 150,
    width: '45%',
    margin:5,

  
    borderRadius:10,

    borderWidth: 1,
    borderColor: '#bbe9ed',
  },
  DocConatiner:{
    backgroundColor:"#bbe9ed",
                  
                  height:30,
                  width:"100%",

                  justifyContent:"center",
                  alignItems:"center",
                  paddingLeft:10,
                  paddingRight:10,
                 paddingTop:5,

                  borderBottomLeftRadius: 10,
                  borderBottomRightRadius: 10,
                  overflow: 'hidden'
      }
  
})