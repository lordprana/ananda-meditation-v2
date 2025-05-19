import { useSelector } from 'react-redux'
import { selectAllLibraryItemsByCallback } from '../../store/meditationLibrariesSlice'
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native'
import { formatSecondsForDisplay } from '../../util'
import { Image } from 'expo-image'
import { useMemo } from 'react'
import { Colors } from '../../constants/Colors'

const PickSegmentFromCategory = ({ category, addMeditationSegment }) => {
  const segments = useSelector(selectAllLibraryItemsByCallback((item) =>
    item.category === category &&
    item.contentfulContentType === 'meditationSegments',
  ))
  const segmentIds = segments.map((segment) => segment.contentfulId)
  const meditationMap = {}

  const meditations = useSelector(selectAllLibraryItemsByCallback((item) => {
    if (item.segments) {
      const itemSegmentIds = item.segments.map((segment) => segment.contentfulId)
      const segmentId = itemSegmentIds.find((segmentId) => segmentIds.includes(segmentId))
      if (segmentId) {
        meditationMap[segmentId] = item
        return true
      } else {
        return false
      }
    }
  }))

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {segments.map((segment) => {
          console.log('mapping segments')
          console.log(segment.contentfulId)
          console.log(meditationMap[segment.contentfulId]?.thumbnailUrl)
          return (
            <TouchableOpacity
              key={segment.contentfulId}
              style={styles.segmentContainer}
              onPress={() => {
                // Handle the segment selection
                addMeditationSegment(segment)
              }}>
              <TouchableOpacity>
                <TouchableOpacity>
                  <Image
                    source={{ uri: segment.thumbnailUrl || meditationMap[segment.contentfulId]?.thumbnailUrl }}
                    style={styles.segmentImage}
                  />
                </TouchableOpacity>
              </TouchableOpacity>
              <Text style={styles.segmentTitle}>
                {segment.title} ({formatSecondsForDisplay(segment.duration)})
              </Text>
            </TouchableOpacity>
          )
        },
      )}
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
  }
})

export default PickSegmentFromCategory
