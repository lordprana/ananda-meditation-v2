import { useEffect, useMemo, useRef, useState } from 'react'
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import { Colors } from '../../constants/Colors'
import { TextInput } from 'react-native-paper'
import Button from '../ui/Button'
import { MaterialIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useDispatch } from 'react-redux'
import DraggableFlatList, { ScaleDecorator } from 'react-native-draggable-flatlist'

import {
  addCustomMeditation,
  addCustomMeditationById,
  getNewCustomMeditation,
  getNewCustomMeditationId,
  removeCustomMeditationById,
  setCustomMeditationSegmentsForEditing,
  updateCustomMeditationTitle,
} from '../../store/customMeditationsSlice'
import { useAddParentMeditationDataToSegments } from '../../hooks/useAddParentMeditationDataToSegments'
import { usePreviewTrackPlayer } from '../../hooks/usePreviewTrackPlayer'
import { SegmentRow } from './PickSegmentFromCategory'

const Segments = ({ segments }) => {
  console.log(segments, 'segments')
  const segmentsWithMeditationData = useAddParentMeditationDataToSegments(segments)
  const {
    playSegmentPreview,
    pauseSegmentPreview,
    isPlaying,
    hasLoaded,
    activePreviewSegment,
  } = usePreviewTrackPlayer()

  const dispatch = useDispatch()
  return (
    <View style={styles.segmentsContainer}>
      {(!segments || segments.length === 0) && <Text style={styles.noTracksText}>No Tracks</Text>}
      {segments.length > 0 &&
        <DraggableFlatList
          data={segmentsWithMeditationData}
          keyExtractor={(segment) => segment.contentfulId}
          onDragEnd={({ data }) => {
            dispatch(setCustomMeditationSegmentsForEditing(data))
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
    thumbnailUrlForEditing,
    title,
    contentfulId,
  } = customMeditation || {}

  console.log(segmentsForEditing, 'segmentsForEditing')
  console.log(customMeditation, 'customMeditation')

  const [newMeditationTitle, setNewMeditationTitle] = useState(title)
  const [savePressed, setSavePressed] = useState(false)
  const textInputRef = useRef(null)
  const dispatch = useDispatch()
  useEffect(() => {
    return () => {
      if (savePressed) {
        dispatch(updateCustomMeditationTitle({
          id: contentfulId,
          title: newMeditationTitle,
        }))

      } else {
        dispatch(removeCustomMeditationById(contentfulId))
      }
    }
  }, [])

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
          <Segments segments={segmentsForEditing} />
        </View>

        <Button label={'Save'} style={styles.saveButton} />
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
    // justifyContent: 'space-between',
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
  saveButton: {
    // position: 'absolute',
    // bottom: 24,
    // left: 16,
    // right: 16,
  },
})

export default CreateOrEditCustomMeditation
