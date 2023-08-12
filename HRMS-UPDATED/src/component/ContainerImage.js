import { StyleSheet, Text, View ,Image} from 'react-native'
import React from 'react'

const ContainerImage = ({link}) => {
 
    const doclink=link.toString()
    const youtubeRegex = /^(https?:\/\/)?(www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/;
  const imageRegex = /\.(jpeg|jpg|gif|png)/i;
  const isYouTubeLink = youtubeRegex.test(doclink);
  const isImageLink=imageRegex.test(doclink);
    if(isYouTubeLink){
      return(
        <Image style={{height:90,width:90}} resizeMode='contain'   source={require("../../assets/Youtube-Icon.png")}/>
          )
    }
    else if(isImageLink){
      return <Image style={{height:90,width:90}} resizeMode='contain'   source={require("../../assets/Image-Icon.png")}/>
       
    }
    else{
      return(
        <Image style={{height:90,width:90}} resizeMode='contain'   source={require("../../assets/PDF.png")}/>
       
        
      )
    }
  
}

export default ContainerImage

const styles = StyleSheet.create({})