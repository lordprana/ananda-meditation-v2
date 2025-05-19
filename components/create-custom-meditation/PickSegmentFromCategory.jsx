import { useSelector } from 'react-redux'
import { selectAllLibraryItemsByCallback } from '../../store/meditationLibrariesSlice'
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { formatSecondsForDisplay } from '../../util'
import { Image } from 'expo-image'
import { useEffect, useState } from 'react'
import { Colors } from '../../constants/Colors'
import { AntDesign } from '@expo/vector-icons'
import TrackPlayer, { Event, State, useTrackPlayerEvents } from 'react-native-track-player'
import { mapSegmentToTrackPlayerTrack } from '../meditation-player/AudioPlayback'
import { useIsFocused } from '@react-navigation/native'

const SegmentRow = ({ segment, meditationMap, addMeditationSegment, playSegmentPreview, pauseSegmentPreview, isPlaying, hasLoaded }) => {
  const thumbnailUrl = segment.thumbnailUrl || meditationMap[segment.contentfulId]?.thumbnailUrl

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
            source={{ uri: thumbnailUrl }}
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

const PickSegmentFromCategory = ({ category, addMeditationSegment }) => {
  const segments = useSelector(selectAllLibraryItemsByCallback((item) =>
    item.category === category &&
    item.contentfulContentType === 'meditationSegments',
  ))
  const segmentIds = segments.map((segment) => segment.contentfulId)
  const meditationMap = {}

  // Populate meditationMap
  useSelector(selectAllLibraryItemsByCallback((item) => {
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

  const [hasLoaded, setHasLoaded] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  const [activePreviewSegment, setActivePreviewSegment] = useState(null)
  const playSegmentPreview = async (segment) => {
    const thumbnailUrl = segment.thumbnailUrl || meditationMap[segment.contentfulId]?.thumbnailUrl
    if (!hasLoaded || activePreviewSegment !== segment.contentfulId) {
      const tracks = [mapSegmentToTrackPlayerTrack({
        ...segment,
        ...{
          thumbnailUrl,
        },
      })]
      await TrackPlayer.reset()
      await TrackPlayer.add(tracks)
    } else {
      await TrackPlayer.play()
    }
    setIsPlaying(true)
    setActivePreviewSegment(segment.contentfulId)
  }
  const pauseSegmentPreview = async (segment) => {
    await TrackPlayer.pause()
    setIsPlaying(false)
  }

  useTrackPlayerEvents([Event.PlaybackState], ({ state }) => {
    if (state === State.Ready) {
      setHasLoaded(true)
      TrackPlayer.play()
    } else if (state === State.Playing) {
      // We have isPlaying in the condition to only update the state of the track
      // the user intended to play
    } else if (state === State.Loading) {
      // This is used to refresh the hasLoaded state if another track
      // is loaded
      setHasLoaded(false)
    }
  })
  const isFocused = useIsFocused()

  useEffect(() => {
    (async () => {
      if (!isFocused) {
        await pauseSegmentPreview()
        await TrackPlayer.reset()
      }
    })()
  }, [isFocused])

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {segments.map((segment) =>
        <SegmentRow
          segment={segment}
          meditationMap={meditationMap}
          addMeditationSegment={addMeditationSegment}
          playSegmentPreview={playSegmentPreview}
          pauseSegmentPreview={pauseSegmentPreview}
          hasLoaded={hasLoaded}
          isPlaying={segment.contentfulId === activePreviewSegment && isPlaying}
          key={segment.contentfulId}
        />)}
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
