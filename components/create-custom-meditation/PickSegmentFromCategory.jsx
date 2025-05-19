import { useSelector } from 'react-redux'
import { selectAllLibraryItemsByCallback } from '../../store/meditationLibrariesSlice'
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { formatSecondsForDisplay } from '../../util'
import { Image } from 'expo-image'
import { Colors } from '../../constants/Colors'
import { AntDesign } from '@expo/vector-icons'
import { usePreviewTrackPlayer } from '../../hooks/usePreviewTrackPlayer'
import { useAddParentMeditationDataToSegments } from '../../hooks/useAddParentMeditationDataToSegments'

export const SegmentRow = ({
                             segment,
                             addMeditationSegment,
                             playSegmentPreview,
                             pauseSegmentPreview,
                             isPlaying,
                             hasLoaded,
                           }) => {
  return (
    <TouchableOpacity
      key={segment.contentfulId}
      style={styles.segmentContainer}
      onPress={() => {
        // Handle the segment selection
        addMeditationSegment(segment)
      }}>
      <TouchableOpacity>
        <TouchableOpacity onPress={async () => {
          if (!isPlaying) {
            await playSegmentPreview(segment)
          } else {
            await pauseSegmentPreview()
          }
        }}>
          <View style={styles.iconContainer}>
            {!isPlaying && <AntDesign name={'playcircleo'} size={36}
                                      color={'rgba(255, 255, 255, 0.8)'} />}
            {isPlaying && hasLoaded && <AntDesign name={'pausecircleo'} size={36}
                                                  color={'rgba(255, 255, 255, 0.8)'} />}
            {isPlaying && !hasLoaded && <ActivityIndicator size={'large'} color={'rgba(255, 255, 255, 0.8)'} />}
          </View>
          <Image
            source={{ uri: segment.thumbnailUrl }}
            style={styles.segmentImage}
          />
        </TouchableOpacity>
      </TouchableOpacity>
      <Text style={styles.segmentTitle}>
        {segment.title} ({formatSecondsForDisplay(segment.duration)})
      </Text>
    </TouchableOpacity>

  )
}

const PickSegmentFromCategory = ({ category, addMeditationSegment, meditationId }) => {
  const segments = useSelector(selectAllLibraryItemsByCallback((item) =>
    item.category === category &&
    item.contentfulContentType === 'meditationSegments',
  ))
  const segmentsWithMeditationData = useAddParentMeditationDataToSegments(segments)

  const {
    playSegmentPreview,
    pauseSegmentPreview,
    isPlaying,
    hasLoaded,
    activePreviewSegment,
  } = usePreviewTrackPlayer()

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {segmentsWithMeditationData.map((segment) => {
        return (<SegmentRow
          segment={segment}
          addMeditationSegment={addMeditationSegment}
          playSegmentPreview={playSegmentPreview}
          pauseSegmentPreview={pauseSegmentPreview}
          hasLoaded={hasLoaded}
          isPlaying={segment.contentfulId === activePreviewSegment && isPlaying}
          key={segment.contentfulId}
        />)
      })}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingVertical: 16,
    backgroundColor: '#fff',
    rowGap: 16,
    flex: 1,
  },
  segmentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 8,

  },
  segmentImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: Colors.light.electricBlue,
  },
  segmentTitle: {
    fontWeight: 400,
  },
  iconContainer: {
    position: 'absolute',
    width: 60,
    height: 60,
    zIndex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default PickSegmentFromCategory
