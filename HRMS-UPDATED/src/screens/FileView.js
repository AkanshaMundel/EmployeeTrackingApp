import { StyleSheet, Text, View ,ActivityIndicator,Image,Dimensions} from 'react-native'
import React from 'react'
import { WebView } from 'react-native-webview';
import { useRoute } from '@react-navigation/native';
import Pdf from 'react-native-pdf';




const FileView = () => {
  const route = useRoute();
  const {link}=route.params
  
  console.log(link)
    const youtubeRegex = /^(https?:\/\/)?(www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/;
    const imageRegex = /\.(jpeg|jpg|gif|png)/i;
    const isYouTubeLink = youtubeRegex.test(link);
    const isImageLink=imageRegex.test(link)
     //console.log(link)
     if(isImageLink){
      return(
        <View style={{flex:1,justifyContent:"center",overflow:"hidden"}}>
        <Image style={{height:"90%",width:"100%"}} resizeMode='contain' source={{uri:link}}/>

        </View>
        
      )
     }
     else if(isYouTubeLink){
      return(
        <WebView   source={{  uri: link }} />
        

      )

     }
     else{
      return(
        
        <View style={styles.container}>
                <Pdf
                  trustAllCerts={false}
                    source={{
                      uri: link,
                      cache: true,
                    }}
                    onLoadComplete={(numberOfPages,filePath) => {
                        console.log(`Number of pages: ${numberOfPages}`);
                    }}
                    onPageChanged={(page,numberOfPages) => {
                        console.log(`Current page: ${page}`);
                    }}
                    onError={(error) => {
                        console.log(error);
                    }}
                    onPressLink={(uri) => {
                        console.log(`Link pressed: ${uri}`);
                    }}
                    style={styles.pdf}/>
            </View>

      )
     }
     
  
   
  
}

export default FileView

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 25,
},
pdf: {
    flex:1,
    width:Dimensions.get('window').width,
    height:Dimensions.get('window').height,
}
})