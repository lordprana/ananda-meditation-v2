import { useEffect, useMemo, useRef, useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { Colors } from '../../constants/Colors'
import { TextInput } from 'react-native-paper'
import Button from '../ui/Button'
import { MaterialIcons } from '@expo/vector-icons'
import { useNavigation, useRouter } from 'expo-router'
import { useDispatch } from 'react-redux'
import DraggableFlatList from 'react-native-draggable-flatlist'

import {
  getNewCustomMeditationId,
  removeCustomMeditationById,
  saveMeditationWithNewTitle,
  setCustomMeditationSegmentsForEditing,
} from '../../store/customMeditationsSlice'
import { useAddParentMeditationDataToSegments } from '../../hooks/useAddParentMeditationDataToSegments'
import { usePreviewTrackPlayer } from '../../hooks/usePreviewTrackPlayer'
import { SegmentRow } from './PickSegmentFromCategory'
import { getMeditationDuration } from '../../store/meditationLibrariesSlice'
import { formatSecondsForDisplayInWords } from '../../util'

const Segments = ({ segments, meditationId }) => {
  const segmentsWithMeditationData = useAddParentMeditationDataToSegments(segments)
  const {
    playSegmentPreview,
    pauseSegmentPreview,
    isPlaying,
    hasLoaded,
    activePreviewSegment,
  } = usePreviewTrackPlayer()
  const totalDuration = useMemo(() => {
    return getMeditationDuration({ segments: segmentsWithMeditationData })
  }, [segmentsWithMeditationData])

  const dispatch = useDispatch()
  return (
    <View style={styles.segmentsContainer}>
      {(!segments || segments.length === 0) && <Text style={styles.noTracksText}>No Tracks</Text>}
      {segments.length > 0 && <Text style={styles.durationText}>{formatSecondsForDisplayInWords(totalDuration)}</Text>}
      {segments.length > 0 &&
        <DraggableFlatList
          data={segmentsWithMeditationData}
          keyExtractor={(segment) => segment.contentfulId}
          onDragEnd={({ data }) => {
            dispatch(setCustomMeditationSegmentsForEditing({
              id: meditationId,
              segments: data
            }))
          }}
          scrollEnabled={true}
          activationDistance={20}
          contentContainerStyle={{
            paddingBottom: 30,
            alignItems: 'stretch',
            width: '100%',
          }}
          style={{ paddingBottom: 30, width: '100%' }}
          renderItem={({ item, drag }) =>
            <SegmentRow
              segment={item}
              style={{ marginBottom: 12, width: '100%' }}
              drag={drag}
              addMeditationSegment={() => {
              }}
              removeMeditationSegment={() => {
                dispatch(setCustomMeditationSegmentsForEditing({
                  segments: segmentsWithMeditationData.filter((segment) => segment.contentfulId !== item.contentfulId),
                  id: meditationId,
                }))
              }}
              playSegmentPreview={playSegmentPreview}
              pauseSegmentPreview={pauseSegmentPreview}
              isPlaying={item.contentfulId === activePreviewSegment && isPlaying}
              hasLoaded={hasLoaded}
            />
          }
        />}
    </View>
  )
}

const ButtonLabel = ({ text, iconName, color }) => {
  return <View style={styles.buttonLabelContainer}>
    <MaterialIcons name={iconName} size={16} color={color} style={styles.buttonLabelIcon} />
    <Text style={[styles.buttonLabelText, { color }]}>
      {text}
    </Text>
  </View>
}

const CreateOrEditCustomMeditation = ({
                                        customMeditation,
                                      }) => {
  const router = useRouter()
  const {
    segmentsForEditing,
    segments,
    thumbnailUrlForEditing,
    title,
    contentfulId,
  } = customMeditation || {}
  const isNewMeditation = customMeditation.segments.length === 0
  const [newMeditationTitle, setNewMeditationTitle] = useState(title)
  const textInputRef = useRef(null)
  const dispatch = useDispatch()
  const saveButtonPressed = useRef(false)
  const onSaveButtonPress = () => {
    dispatch(saveMeditationWithNewTitle({
      id: contentfulId,
      title: newMeditationTitle,
    }))
    saveButtonPressed.current = true
    router.back()
  }

  const navigation = useNavigation()
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      console.log('go back')
      e.preventDefault()
      if (!saveButtonPressed.current && isNewMeditation) {
        dispatch(removeCustomMeditationById(contentfulId))
      } else if (!saveButtonPressed.current) {
        dispatch(setCustomMeditationSegmentsForEditing({
          id: contentfulId,
          segments
        }))
      }
      navigation.dispatch(e.data.action)
    })
    return unsubscribe
  }, [isNewMeditation, navigation, contentfulId])

  return (
    <Pressable
      style={styles.backgroundView}
      onPress={() => textInputRef.current.blur()}
    >
      <View style={styles.innerContainer}>
        <View style={styles.topContainer}>
          <TextInput
            ref={textInputRef}
            label={'Title'}
            value={newMeditationTitle}
            onChangeText={setNewMeditationTitle}
            activeUnderlineColor={Colors.light.electricBlue}
            selectionColor={Colors.light.electricBlue}
            cursorColor={Colors.light.electricBlue}
            activeOutlineColor={Colors.light.electricBlue}
            mode={'flat'}
            onFocus={() => {
              if (newMeditationTitle === 'Untitled') {
                setNewMeditationTitle('')
              }
            }}
            style={{
              marginBottom: 16,
              backgroundColor: 'transparent',
            }}
          />
          <Button
            alternative={true}
            label={<ButtonLabel
              color={Colors.light.electricBlue}
              text={'Background'}
              iconName={'image'}
            />}
            backgroundColor={Colors.light.electricBlue}
            style={styles.button}
            onPress={() => router.push(`pick-custom-meditation-image/${contentfulId}`)}
          />
          <Button
            alternative={true}
            label={<ButtonLabel
              color={Colors.light.electricBlue}
              text={'Add Track'}
              iconName={'playlist-add'}
            />}
            backgroundColor={Colors.light.electricBlue}
            style={styles.button}
            onPress={() => router.push(`pick-custom-meditation-track/${contentfulId}`)}
          />
          <Segments segments={segmentsForEditing} meditationId={contentfulId} />
        </View>

        <Button
          label={'Save'}
          style={styles.saveButton}
          onPress={onSaveButtonPress}
          disabled={segmentsForEditing.length === 0}
        />
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  backgroundView: {
    flex: 1,
    backgroundColor: Colors.light.electricBlue,
  },
  innerContainer: {
    flex: 1,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 16,
    backgroundColor: '#fff',
  },
  topContainer: {
    flex: 1,
  },
  buttonLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: 6,
  },
  button: {
    marginVertical: 12,
  },
  buttonLabelText: {
    fontSize: 14,
    fontWeight: '600',
  },
  buttonLabelIcon: {
    width: 16,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  segmentsContainer: {
    alignItems: 'stretch',
    flex: 1,
    paddingVertical: 12,
  },
  noTracksText: {
    color: '#888',
    width: '100%',
    textAlign: 'center',
  },
  durationText: {
    width: '100%',
    textAlign: 'center',
    textTransform: 'capitalize',
    fontWeight: 500,
    marginBottom: 16,
  },
  saveButton: {
    marginBottom: 12,
  },
})

export default CreateOrEditCustomMeditation
