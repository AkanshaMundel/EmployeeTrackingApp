import { StyleSheet, Text, View,TouchableOpacity,FlatList,Image } from 'react-native'
import React,{useContext, useState,useEffect} from 'react'
import { AuthContext } from '../context/AuthContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ContainerImage from '../component/ContainerImage';
import { BASE_URL } from '../ConfigLinks';
import axios from 'axios';
const Training = ({navigation}) => {
  useEffect(() => {
   getDocument();
  },[]);
  const { isLogin } = useContext(AuthContext);
  const [document,setDocument]=useState([])
  const getDocument=()=>{
    axios.get(`${BASE_URL}training/`,
       
    ).then(res=>{
      //console.log(res.data);
      setDocument(res.data?.trainingData);
      //console.log(documents)
      }).catch((error)=>{
        console.log(error)
      })

  }
  
  
   if(isLogin){
    return (
    <View style={{flex:1}}>

          <View style={styles.container}>
        <View  style={{paddingTop:15}}>
        <View style={{flexDirection:"row"}} >
         
              
         <TouchableOpacity onPress={()=>navigation.navigate("Assessment")}>
         <Text style={[styles.btntextStyle]}>Attempt Assessment Quiz</Text>
         </TouchableOpacity>
         <View style={{alignItems:"flex-end",marginLeft:"10%"}}>
         <Icon onPress={()=>navigation.navigate("Assessment")} name="arrow-right" color="#46327d"  size={35}/>
         </View>
         
     
     </View>
            </View>
            </View>
      
      <Text style={styles.HeadingStyle}>Training Resources</Text>
    
    <FlatList
    numColumns={2}
    data={document}
    style={styles.grid}
    renderItem={({item, index}) => (
  
      <View style={styles.card}>
        <View style={{overflow:"hidden",alignItems:"center",position:"relative"}}>
         
              <ContainerImage link={link}/>
          
          </View>
          <View style={{marginTop:30}}>
        <View style={styles.DocConatiner}>
          <TouchableOpacity onPress={()=>navigation.navigate("FileView",{"link":link})}>
          
          <Text style={{color:"#080a80"}}>ReactNative Course</Text>
          </TouchableOpacity>
          </View>
          </View>
          </View>
         
    
    )}
    />
    </View>
    
  )
    }
    else{
      return(
        <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
          <Text style={{fontSize:20}}>Login First</Text>
         
        </View>
      )
    }
}

export default Training

const styles = StyleSheet.create({
    btntextStyle:{
        fontSize:20,
        color:"#46327d",
        fontWeight:"800",
        marginLeft:10
    },
    HeadingStyle:
      {fontSize:25,
        fontWeight:"700",
        color:"black",
        marginLeft:20,
        marginTop:30}

    ,
     textStyle:{
        fontSize:15,
        color:"",
        fontWeight:"500"
    },
    container: {
      width:"90%", 
      alignSelf:"center",
      backgroundColor:"#ECEDFE",
      marginTop:"10%",
      borderRadius:10,
      elevation:1,
      flexDirection:"column",
      
      height:60,
      },
      grid: {
        margin: 12,
        marginBottom:"15%"
      },
      card: {
        height: 150,
        width: '45%',
        margin:5,
        flex:1,
        flexDirection:"column",
        
    
      
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
                      overflow: 'hidden',
                      
                   

      }
})