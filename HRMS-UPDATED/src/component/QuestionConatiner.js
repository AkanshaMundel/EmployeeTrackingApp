import { StyleSheet, Text, View ,TouchableOpacity,FlatList} from 'react-native'
import React from 'react'
import { RadioButton } from 'react-native-paper';


const QuestionConatiner = ({item,index,options,selectedOption, onSelectOption}) => {
  //console.log(item.options)
    return(
<View style={styles.questionContainer}>
      <Text style={styles.questionText}>Q{index+1}.{item.question}</Text>
      <FlatList data={options} renderItem={(option,index)=>(
        <View style={{flexDirection:"row"}}>
         <RadioButton  onPress={() => onSelectOption(option.item)} status={selectedOption === option.item ? 'checked' : 'unchecked'}/>
       
        <TouchableOpacity
        key={index}
        style={[
          styles.optionButton
        ]}
        onPress={() => onSelectOption(option.item)}
      >
       
        <Text style={styles.optionText}>{option.item}</Text>
      </TouchableOpacity>
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
    backgroundColor: '#264678', 
    borderColor: '#00c853',
    borderWidth: 2,
  }
});

export default QuestionConatiner
