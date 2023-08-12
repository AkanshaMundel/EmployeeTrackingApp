import { StyleSheet, Text, View ,TouchableOpacity,FlatList} from 'react-native'
import React from 'react'
import { RadioButton } from 'react-native-paper';


const ResultConatiner = ({item,index,options,selectedOption}) => {
  //console.log(item.options)
    return(
<View style={styles.questionContainer}>
      <Text style={styles.questionText}>Q{index+1}.{item.question}</Text>
      <FlatList data={options} renderItem={(option,index)=>(
         <View style={{flexDirection:"row"}}>
         <RadioButton  status={selectedOption === option.item || item.correct_answer===option.item  ? 'checked' : 'unchecked'}
         //color={selectedOption === option.item && selectedOption===item.correct_answer ? 'green' :item.correct_answer===option.item?"green":'red'}
         
         />
       
        <View
        key={index}
        style={[
          styles.optionButton
        ]}
        
      >
       
        <Text style={styles.optionText}>{option.item}</Text>
      </View>
      </View>
        

      )}/>
     
    </View>
  );
};

const styles = StyleSheet.create({
  questionContainer: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 10,
    borderRadius: 8,
  },
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color:"#000"
  },
  optionButton: {
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 8,
    borderRadius: 6,
  },
  optionText: {
    fontSize: 16,
    color:"#000"
  },
  selectedOptionButton: {
    backgroundColor: '#19b543', 
    borderColor: '#00c853',
    borderWidth: 2,
  },
  wrongOptionButton: {
    backgroundColor:"#c40a13"
  }
});

export default ResultConatiner
