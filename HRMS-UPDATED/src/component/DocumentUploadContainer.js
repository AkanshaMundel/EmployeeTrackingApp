import { Image, Pressable, StyleSheet, Text, View,TouchableOpacity ,Alert, ActivityIndicator} from 'react-native'
import React, {useState,useContext,useEffect} from 'react'
import { AuthContext } from '../context/AuthContext';
import Icon from 'react-native-vector-icons/Feather';
import DocumentPicker from 'react-native-document-picker'
import axios from 'axios'
import { BASE_URL } from '../ConfigLinks';


const DocumentUpload= ({document_name,onLoad}) => {
  const { userInfo, isLoading, logout } = useContext(AuthContext);
  const { employee } = userInfo;
  const Id = employee ? employee._id: 'null';
    
  
  

 
  const selectFile = async () => {
       
    try {
      const res = await DocumentPicker.pickSingle({
        // Provide which type of file you want user to pick
        type: [DocumentPicker.types.images,DocumentPicker.types.pdf],
        
        
      });
      // Printing the log realted to the file
      
     console.log('res : ' + JSON.stringify(res));
     //console.log(res.length)
    
      if (res) {
        onLoad(true)
    
        try {
          
          const formData = new FormData();
          formData.append('file', {
            uri:res.uri,
            type: res.type,
            name: res.name,
          });
          formData.append('emplyeeId',Id)
          formData.append('fileName',document_name)
          console.log(formData)
    
          
    
          const response = await axios.post(
            `${BASE_URL}/employee/docs/upload`,
            formData,
          );
          onLoad(false)
          console.log(response.data);
          Alert.alert('File Upload', 'File Upload Sucessfully', [
            
            {text: 'OK', onPress: () => console.log('OK Pressed')},
          ]);
        
    
        } catch (error) {
          console.log(error);
           onLoad(false)
        }
      } else {
        onLoad(false)
        
        console.log('No file selected');
        
      }
     
      
     

      
      
      
    } catch (err) {
     
      
      if (DocumentPicker.isCancel(err)) {
      
        console.log('Canceled');
      } else {
       
        console.log('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    }
  };
  
    
      return (

        <View style={styles.container}>
          <View style={{width:"50%"}}>
            <Text style={styles.textStyle}>{document_name}</Text>
              </View>
              <TouchableOpacity style={styles.UploadButtonContainer} onPress={()=>selectFile()} >
                <View style={{ flexDirection: "row", gap: 5 }}>
                  <Text style={[styles.btntextStyle]}>Upload</Text>
                  <Icon style={{ marginTop: 5 }} name="upload" size={15} color="#fff" />
                </View>
              </TouchableOpacity>
            </View>
         
        
      )
            
    }
    
    const styles = StyleSheet.create({
      container: {
        width: "90%",
        alignSelf: "center",
        backgroundColor: "#f0ffff",
        marginTop: "10%",
        borderRadius: 8,
        elevation: 1,
        flexDirection: "row",
        alignItems: "center",
        height: 70,
        flex:1,
      },
      UploadButtonContainer:{
              backgroundColor: "#0b0a4d",
                borderRadius: 7,
                height: 30,
                justifyContent: "center",
                alignItems: "flex-end",
                paddingLeft: 10,
                paddingRight: 10,
                marginLeft: "10%",
                overflow:"hidden"

      },
      btntextStyle: {
        fontSize: 20,
        color: "#fff",
        fontWeight: "500",
        
      },
      textStyle: {
        fontSize: 20,
        color: "#04010d",
        fontWeight: "700",
        paddingLeft:10
      },
      rowContainer: {
        flexDirection: 'row',
      },
      image: {
        width: 90,
        height: 150,
        resizeMode: 'contain',
        marginRight: 12,
      },
      name: {
        marginBottom: 4,
        fontSize: 15,
        fontWeight: '500',
      },

    });
    
    export default DocumentUpload;
