import { useSelector } from 'react-redux'
import { selectAllLibraryItemsByCallback } from '../../store/meditationLibrariesSlice'
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { formatSecondsForDisplay } from '../../util'
import { Image } from 'expo-image'
import { useEffect, useMemo, useState } from 'react'
import { Colors } from '../../constants/Colors'
import { AntDesign } from '@expo/vector-icons'
import TrackPlayer, { State, Event, useTrackPlayerEvents } from 'react-native-track-player'
import { mapSegmentToTrackPlayerTrack } from '../meditation-player/AudioPlayback'

const SegmentRow = ({ segment, meditationMap, addMeditationSegment }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const thumbnailUrl = segment.thumbnailUrl || meditationMap[segment.contentfulId]?.thumbnailUrl
  const playSegment = async () => {
    const tracks = [mapSegmentToTrackPlayerTrack({
      ...segment,
      ...{
        thumbnailUrl,
      },
    })]
    await TrackPlayer.reset()
    await TrackPlayer.add(tracks)
    setIsPlaying(true)
    setIsLoading(true)
  }

  useTrackPlayerEvents([Event.PlaybackState], ({ state }) => {
    console.log(state)
    if (state === State.Ready) {
      TrackPlayer.play()
    } else if (!isLoading && (state === State.Paused || state === State.Stopped || state === State.Ended)) {
      // We must set isLoading to false here
      // because the state cycles through paused before
      // beginning to play
      setIsPlaying(false)
    } else if (state === State.Playing) {
      setIsLoading(false)
    }
  })

  useEffect(() => {
    return () => {
      (async () => {
        await TrackPlayer.stop()
        await TrackPlayer.reset()
      })()
    }
  }, [])
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
          if (isPlaying && !isLoading) {
            await TrackPlayer.pause()
          } else {
            await playSegment()
          }
        }}>
          <View style={styles.iconContainer}>
            {!isPlaying && !isLoading && <AntDesign name={'playcircleo'} size={36}
                                                        color={'rgba(255, 255, 255, 0.8)'} />}
            {isPlaying && !isLoading && <AntDesign name={'pausecircleo'} size={36}
                                                           color={'rgba(255, 255, 255, 0.8)'} />}
            {isPlaying && isLoading && <ActivityIndicator size={'large'} color={'rgba(255, 255, 255, 0.8)'} />}
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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {segments.map((segment) =>
        <SegmentRow
          segment={segment}
          meditationMap={meditationMap}
          addMeditationSegment={addMeditationSegment}
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
