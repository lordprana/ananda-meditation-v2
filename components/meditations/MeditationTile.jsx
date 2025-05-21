import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import IonIcons from '@expo/vector-icons/Ionicons'
import React, { useMemo } from 'react'
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
import { removeCustomMeditationById } from '@/store/customMeditationsSlice'
import { Colors } from '@/constants/Colors'
import { FontAwesome6 } from '@expo/vector-icons'


const MeditationTile = ({
                          meditation,
                          style,
                          hideToggleVideoButton = false,
                          isCustomMeditation,
                        }) => {
  const { title, contentfulId, image } = meditation
  const duration = getMeditationDuration(meditation)
  const iconSize = 24
  const iconColor = 'rgba(0, 0, 0, 0.5)'
  const dispatch = useDispatch()
  const isFavoriteMeditation = useSelector(selectIsFavoriteMeditation(contentfulId))
  const isDisabledVideoMeditation = useSelector(selectIsDisabledVideoMeditation(contentfulId))
  const offlineMeditationStatus = useSelector(selectOfflineMeditationStatus(contentfulId))
  const isIndefiniteMeditation = useMemo(() => {
    return !!meditation.segments.find((segment) => segment.isIndefinite === true)
  }, [meditation])

  const toggleFavoriteMeditation = () => dispatch(toggleFavorite(contentfulId))
  const toggleDisabledVideoMeditation = () => dispatch(toggleDisabledVideo(contentfulId))
  const toggleOfflineMeditation = () => dispatch(toggleOfflineMeditationAsync(meditation))
  const deleteCustomMeditation = () => dispatch(removeCustomMeditationById(contentfulId))
  const editCustomMeditation = () => {
    // Navigate to the edit screen for the custom meditation
    router.push(`/create-custom-meditation/${encodeURIComponent(contentfulId)}`)
  }

  const router = useRouter()

  return (
    <TouchableOpacity
      style={[styles.videoTile, style]}
      onPress={() => router.push(`/meditation-player/${encodeURIComponent(contentfulId)}`)}
    >
      <Image
        source={{ uri: image?.portraitUrl }}
        style={styles.thumbnail}
      />
      <View style={styles.bottomHalfContainer}>

        <View>
          <Text style={styles.duration}>
            {isIndefiniteMeditation ?
              <FontAwesome6 name={'infinity'} size={13} color={'#888'} /> :
              formatSecondsForDisplay(duration)}
          </Text>
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
          </TouchableOpacity> : !isCustomMeditation ? <View /> : null}
          {!isCustomMeditation && <TouchableOpacity onPress={toggleFavoriteMeditation}>
            {!isFavoriteMeditation && <IonIcons name={'heart-outline'} size={iconSize} color={iconColor} />}
            {isFavoriteMeditation && <IonIcons name={'heart'} size={iconSize} color={iconColor} />}
          </TouchableOpacity> }
          {isCustomMeditation && <TouchableOpacity onPress={deleteCustomMeditation}>
            <IonIcons name={'trash-outline'} size={iconSize} color={iconColor} />
          </TouchableOpacity> }
          {isCustomMeditation && <TouchableOpacity onPress={editCustomMeditation}>
            <IonIcons name={'create-outline'} size={iconSize} color={iconColor} />
          </TouchableOpacity> }
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
    backgroundColor: Colors.light.electricBlue,
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
    fontWeight: 600,
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
