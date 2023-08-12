import { StyleSheet, Text, View ,FlatList,TouchableOpacity,BackHandler} from 'react-native'
import React ,{useEffect} from 'react'
import ResultConatiner from '../component/ResultContainer'
import { useRoute } from '@react-navigation/native';

const AssessmentResult = ({navigation}) => {
  const route = useRoute();
  const {Score,Percentage,MaxScore,question,setSelectedOptions}=route.params
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true)
    return () => backHandler.remove()
  }, [])
  
const handleReattemptQuiz = () => {
  setSelectedOptions({})
  navigation.navigate('Assessment'); // Navigate back to the Assessment screen
};



   if(Percentage>35){
  
  return (
    
    <View style={{flex:1}}>
      <Text style={styles.mainHeadingStyle}>You passed the assesment!</Text>
      <Text style={{fontSize:15,fontWeight:"700",color:"black",marginLeft:20,marginTop:10,color:"#27AE60"}}>Score:{Score}/{MaxScore}</Text>
      {/*
     <FlatList data={question} renderItem={(item, index) => (
       
       <ResultConatiner
       item={item.item} 
       options={item.item.options} 
       index={item.index} 
       //selectedOption={selectedOption[item.index]}
      />
       
     )} />*/}
     <TouchableOpacity onPress={()=>navigation.navigate("Training")} style={styles.GoToButton}>
        <Text style={{color:"#283093",fontSize:15}}>Go Back to Training Resources</Text>
      </TouchableOpacity>
    
    </View>
  )
}
else{
  return (
    <View style={{flex:1,backgroundColor:"#FFFFFF",}}>
       <Text style={styles.mainHeadingStyle}>You failed the assesment!</Text>
      <Text style={{fontSize:15,fontWeight:"700",color:"black",marginLeft:20,marginTop:10,color:"#E23F3F"}}>Score:{Score}/{MaxScore}</Text>
      <View style={{flex:1,justifyContent:"center"}}>
      <TouchableOpacity onPress={()=>navigation.navigate("Training")} style={styles.GoToButton}>
        <Text style={{color:"#283093",fontSize:15}}>Go Back to Training Resources</Text>
      </TouchableOpacity>
      <TouchableOpacity  onPress={handleReattemptQuiz} style={styles.ReattemptButton}>
        <Text style={{color:"#FFFFFF",fontSize:15,paddingTop:8}}>Reattempt Quiz</Text>
      </TouchableOpacity>
      </View>
      


    </View>
  )
}
}

export default AssessmentResult

const styles = StyleSheet.create({
  mainHeadingStyle:{
    fontSize:25,
    fontWeight:"700",
    color:"black",
    marginLeft:20,
    marginTop:50

  },
  ReattemptButton:{
    backgroundColor:'#283093',
    width:"80%",
    height:55,
    padding:10,
    borderRadius:10,
    alignItems:"center",
    marginLeft:"10%",
    margin:35},
    GoToButton:{backgroundColor:"#FFFFFF", 
    borderWidth: 2, 
    borderColor: '#283093',
    width:"80%",
    height:55,
    padding:10,
    borderRadius:10,
    alignItems:"center",
    marginLeft:"10%",
    marginBottom:10}
})