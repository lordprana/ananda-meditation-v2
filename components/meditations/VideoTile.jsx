import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import IonIcons from '@expo/vector-icons/Ionicons'
import React from 'react'

const VideoTile = ({
                     title,
                     duration,
                     videoUrl,
                     thumbnailUrl,
                     hideToggleVideoButton=false,
                   }) => {
  const iconSize = 24
  const iconColor = 'rgba(0, 0, 0, 0.5)'
  return (
    <TouchableOpacity style={styles.videoTile}>
      <Image
        source={{ uri: thumbnailUrl }}
        style={styles.thumbnail}
      />
      <View style={styles.bottomHalfContainer}>

        <View>
          <Text style={styles.duration}>{duration}</Text>
          <Text style={styles.title}>{title}</Text>
        </View>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity>
            <IonIcons name={'cloud-download-outline'} size={iconSize} color={iconColor} />
          </TouchableOpacity>
          {!hideToggleVideoButton ? <TouchableOpacity>
            <IonIcons name={'videocam-outline'} size={iconSize} color={iconColor} />
          </TouchableOpacity> : <View/> }
          <TouchableOpacity>
            <IonIcons name={'heart-outline'} size={iconSize} color={iconColor} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  videoTile: {
    width: 180,
    height: 300,
    margin: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  thumbnail: {
    width: '100%',
    height: '60%',
    marginBottom: 6,
  },
  bottomHalfContainer: {
    justifyContent: 'space-between',
    flex: 1,
    paddingHorizontal: 6,
    paddingTop: 4,
    paddingBottom: 2,
  },
  duration: {
    fontSize: 14,
    fontWeight: 400,
    color: '#888',
  },
  title: {
    fontSize: 16,
    fontWeight: 600,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5,
  }
})

export default VideoTile
