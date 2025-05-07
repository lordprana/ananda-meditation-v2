import { ActivityIndicator, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import IonIcons from '@expo/vector-icons/Ionicons'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectIsFavoriteMeditation, toggleFavoriteAsync } from '@/store/favoriteMeditationsSlice'
import { selectIsDisabledVideoMeditation, toggleDisabledVideoAsync } from '@/store/disabledVideoMeditationsSlice'
import { selectOfflineMeditationStatus, toggleOfflineMeditationAsync } from '@/store/offlineMeditationStatusesSlice'


const VideoTile = ({
                     title,
                     duration,
                     videoUrl,
                     thumbnailUrl,
                     style,
                     hideToggleVideoButton = false,
                   }) => {
  const iconSize = 24
  const iconColor = 'rgba(0, 0, 0, 0.5)'
  const dispatch = useDispatch()
  const isFavoriteMeditation = useSelector(selectIsFavoriteMeditation(videoUrl))
  const isDisabledVideoMeditation = useSelector(selectIsDisabledVideoMeditation(videoUrl))
  const offlineMeditationStatus = useSelector(selectOfflineMeditationStatus(videoUrl))

  const toggleFavoriteMeditation = () => dispatch(toggleFavoriteAsync(videoUrl))
  const toggleDisabledVideoMeditation = () => dispatch(toggleDisabledVideoAsync(videoUrl))
  const toggleOfflineMeditation = () => dispatch(toggleOfflineMeditationAsync(videoUrl))

  return (
    <TouchableOpacity style={[styles.videoTile, style]}>
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
          <TouchableOpacity onPress={toggleOfflineMeditation} disabled={offlineMeditationStatus === 'pending'}>
            {offlineMeditationStatus === 'readyToDownload' &&
              <IonIcons name={'cloud-download-outline'} size={iconSize} color={iconColor} />}
            {offlineMeditationStatus === 'pending' && <ActivityIndicator size={iconSize} color={iconColor} />}
            {offlineMeditationStatus === 'completed' &&
              <IonIcons name={'cloud-done'} size={iconSize} color={iconColor} />}
          </TouchableOpacity>
          {!hideToggleVideoButton ? <TouchableOpacity onPress={toggleDisabledVideoMeditation}>
            {!isDisabledVideoMeditation && <IonIcons name={'videocam-outline'} size={iconSize} color={iconColor} />}
            {isDisabledVideoMeditation && <IonIcons name={'videocam-off-outline'} size={iconSize} color={iconColor} />}
          </TouchableOpacity> : <View />}
          <TouchableOpacity onPress={toggleFavoriteMeditation}>
            {!isFavoriteMeditation && <IonIcons name={'heart-outline'} size={iconSize} color={iconColor} />}
            {isFavoriteMeditation && <IonIcons name={'heart'} size={iconSize} color={iconColor} />}
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
  },
})

export default VideoTile
