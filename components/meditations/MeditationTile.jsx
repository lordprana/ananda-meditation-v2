import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import IonIcons from '@expo/vector-icons/Ionicons'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectIsFavoriteMeditation, toggleFavorite } from '@/store/favoriteMeditationsSlice'
import {
  selectIsDisabledVideoMeditation,
  toggleDisabledVideo,
  toggleDisabledVideoAsync,
} from '@/store/disabledVideoMeditationsSlice'
import { selectOfflineMeditationStatus, toggleOfflineMeditationAsync } from '@/store/offlineMeditationStatusesSlice'
import { formatSecondsForDisplay } from '@/util'
import { useRouter } from 'expo-router'
import { getMeditationDuration } from '@/store/meditationLibrariesSlice'


const MeditationTile = ({
                          meditation,
                          style,
                          hideToggleVideoButton = false,
                        }) => {
  const { title, contentfulId, thumbnailUrl } = meditation
  const duration = getMeditationDuration(meditation)
  const iconSize = 24
  const iconColor = 'rgba(0, 0, 0, 0.5)'
  const dispatch = useDispatch()
  const isFavoriteMeditation = useSelector(selectIsFavoriteMeditation(contentfulId))
  const isDisabledVideoMeditation = useSelector(selectIsDisabledVideoMeditation(contentfulId))
  const offlineMeditationStatus = useSelector(selectOfflineMeditationStatus(contentfulId))

  const toggleFavoriteMeditation = () => dispatch(toggleFavorite(contentfulId))
  const toggleDisabledVideoMeditation = () => dispatch(toggleDisabledVideo(contentfulId))
  const toggleOfflineMeditation = () => dispatch(toggleOfflineMeditationAsync(meditation))

  const router = useRouter()

  return (
    <TouchableOpacity
      style={[styles.videoTile, style]}
      onPress={() => router.push(`/meditation-player/${encodeURIComponent(contentfulId)}`)}
    >
      <Image
        source={{ uri: thumbnailUrl }}
        style={styles.thumbnail}
      />
      <View style={styles.bottomHalfContainer}>

        <View>
          <Text style={styles.duration}>{formatSecondsForDisplay(duration)}</Text>
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

export default MeditationTile
