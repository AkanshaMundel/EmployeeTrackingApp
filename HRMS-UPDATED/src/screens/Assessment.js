import { StyleSheet, Text, View,Linking,FlatList,ScrollView,Button, TouchableOpacity}from 'react-native'
import React, { useState,useEffect,useContext} from 'react'
import { AuthContext } from '../context/AuthContext';

import QuestionConatiner from '../component/QuestionConatiner';

import axios from 'axios';
import LoadingScreen from './LoadingScreen';
import { BASE_URL } from '../ConfigLinks';
const Assessment = ({navigation}) => {
  const { userInfo, isLoading, logout } = useContext(AuthContext);
  const[loding,setLoading]=useState(true)
  const { employee } = userInfo;
  const jobProfileId = employee ? employee.jobProfileId._id: 'null';
    
    const [selectedOptions, setSelectedOptions] = useState({});
    const [questions, setQuestions] = useState([]);
   
    const getQuestion=()=>{
      axios.post(`${BASE_URL}/quiz/getQuiz`,
      {
        "jobProfileId":jobProfileId
      }
      ).then(res=>{
        
        setQuestions(res.data.questions)
        setLoading(false)
        }).catch((error)=>{
          console.log(error)
          setLoading(false)
        })
    }
   
    getQuestion()

    
  const handleSelectOption = (questionIndex, option) => {
    //console.log(questionIndex)
    setSelectedOptions((prevSelectedOptions) => ({
      ...prevSelectedOptions,
      [questionIndex]: option,
    }));
  };
  const SumbitAnswer=()=>{
    setLoading(true)
    axios.post(`${BASE_URL}/quiz/submitAnswer`,
    {
      "answers":selectedOptions,
      "jobProfileId":jobProfileId
    }
    ).then(res=>{
      //console.log(res.data)
      setLoading(false)
     

      navigation.navigate("AssessmentResult",
      {"Score":res.data.score,"Percentage":res.data.percent,"MaxScore":questions.length,"question":questions,"setSelectedOptions": setSelectedOptions})
      
    }).catch((error)=>{
      console.log(error)
      setLoading(false)
    })

  }
  const handleSumbit=()=>{
    //console.log(selectedOptions)
    const len=questions.length;
    for(let i=0;i<len;i++){
      if(!selectedOptions[i]){
        selectedOptions[i]=""
      }
      

    }
    setSelectedOptions(selectedOptions)
    SumbitAnswer()

    //console.log(selectedOptions)
  }
  if(isLoading){
    return(
      <LoadingScreen/>
    )
  }
  
  else{
  return (
    
    <View style={{flex:1,backgroundColor:"#FFFFFF"}}>
      
    <Text style={{fontSize:25,fontWeight:"700",color:"black",marginLeft:20,marginTop:50}}>Assessment Quiz</Text>
   
   <FlatList data={questions} renderItem={(item, index) => (
       
        <QuestionConatiner item={item.item} options={item.item.options} index={item.index} selectedOption={selectedOptions[item.index]}
        onSelectOption={(option) => handleSelectOption(item.index, option)}/>
        
      )} />
     <TouchableOpacity
      onPress={handleSumbit}
      style={{
      backgroundColor:"#283093",
      borderRadius:10,
      padding:10,
      alignItems:"center",
      width:"40%",
      margin:10,
      marginBottom:"15%"
     }
  
     }>
      <Text style={{color:"#FFF",fontSize:15,fontWeight:"800"}}>Sumbit</Text>
     </TouchableOpacity>
   
      
    
  
    
    </View>
  )
    }
}

export default Assessment

const styles = StyleSheet.create({
  selectedOptionButton: {
    backgroundColor: '#264678', 
    borderColor: '#00c853',
    borderWidth: 2,
  },
})