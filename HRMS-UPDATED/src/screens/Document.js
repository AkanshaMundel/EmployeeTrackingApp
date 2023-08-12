import { StyleSheet, Text, View,TouchableOpacity,FlatList,ScrollView } from 'react-native'
import React,{useState,useContext} from 'react'

import { AuthContext } from '../context/AuthContext';
import DocumentUpload from '../component/DocumentUploadContainer'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LoadingScreen from './LoadingScreen';



const Document = ({navigation}) => {
  const { isLogin } = useContext(AuthContext);
   const [loading,setLoading]=useState(false)
   const handleLoading=(load)=>{
    if(load){
      setLoading(true)
    }
    else{
      setLoading(false)
    }
   }
  
  const documents=["Resume","Photo","Aadhar Card","BankPassbook"]
    if(loading){
      return(
        <LoadingScreen/>
      )

    }
    else if(!isLogin){
      return(
        <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
          <Text style={{fontSize:20}}>Login First</Text>
         
        </View>
      )
    }
    else{
      return(
    <View style={{flex:1,backgroundColor:"#fff"}}>
      <View style={styles.container}>
        <View  style={{paddingTop:15}}>
        <View style={{flexDirection:"row"}} >
          <View style={{width:"50%"}}>
         
              <TouchableOpacity onPress={()=>navigation.navigate("DocumentView")}>
                <Text style={[styles.btntextStyle]}>View Document</Text>
                </TouchableOpacity>
                </View>
                <View style={{alignItems:"flex-end",marginLeft:"40%"}}>
                <Icon onPress={()=>navigation.navigate("DocumentView")} name="arrow-right" color="#46327d"  size={35}/>
                </View>
                
            
            </View>
            </View>
            </View>
      <View style={{marginTop:30}}>
        <Text style={styles.HeadingStyle}>Pending Uploads</Text>
       
        <FlatList style={{marginBottom:"15%"}} data={documents} renderItem={(item,index)=>(
          <DocumentUpload document_name={item.item} onLoad={(option) => handleLoading(option)} />

        )}/>
        
        
       
        

       
      
      </View>
    </View>
  )
        }
}

export default Document

const styles = StyleSheet.create({
  HeadingStyle:{
    fontSize:25,
    fontWeight:"bold",
    color:"black",
    marginLeft:20

  },
  btntextStyle:{
    fontSize:20,
    color:"#46327d",
    fontWeight:"800",
    marginLeft:10,
    marginTop:5
},
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
})