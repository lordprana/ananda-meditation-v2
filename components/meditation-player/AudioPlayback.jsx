import { forwardRef, useEffect, useImperativeHandle, useMemo } from 'react'
import FadeView from '../ui/FadeView'
import { StyleSheet, Image } from 'react-native'
import TrackPlayer, { useTrackPlayerEvents, Event, State, useProgress, useActiveTrack } from 'react-native-track-player'
import { getSafeFileUri } from '../../store/offlineMeditationStatusesSlice'
import { useOrientation } from '../../hooks/useOrientation'

function mapPositionToSegment(segments, globalPosition) {
  let cumulative = 0

  for (let i = 0; i < segments.length; i++) {
    const fileDuration = segments[i].duration

    if (globalPosition < cumulative + fileDuration) {
      return { index: i, positionInSegment: globalPosition - cumulative }
    }

    cumulative += fileDuration
  }

  // If position exceeds total duration, return the end of the last file
  const lastIndex = segments.length - 1
  return { index: lastIndex, positionInSegment: segments[lastIndex].duration }
}

function getGlobalCurrentPosition(segments, position, activeTrackIndex) {
  return position +
    segments.reduce((acc, segment, index) => {
      if (index < activeTrackIndex) {
        return acc + segment.duration
      }
      return acc
    }, 0)
}

// Silent segments may have nested segments
const flattenSilentSegments = (segments) => {
  const result = []

  for (const segment of segments) {
    if (segment.type === 'Silent' && Array.isArray(segment.segments)) {
      const expanded = flattenSilentSegments(segment.segments)  // Recursively flatten
      result.push(...expanded)
    } else {
      result.push(segment)
    }
  }

  return result
}

export const mapSegmentToTrackPlayerTrack = ({
                                         contentfulId,
                                         title,
                                         audioUrl,
                                         duration,
                                         image,
                                         teacher,
                                       }) => ({
  id: contentfulId,
  title,
  url: audioUrl,
  duration,
  artwork: image?.portraitUrl,
  artist: teacher,
})

const AudioPlayback = forwardRef(({
                                    meditationId,
                                    isOffline,
                                    setPlaybackStatus,
                                    segments,
                                    image, // Shown in system player
                                    teacher,
                                    dimmed,
                                    setIsBuffering,
                                    setIsPlaying,
                                    setPosition,
                                    setIsLoaded,
                                  }, ref) => {

  const getTracks = async (segments, image, teacher) => {
    return Promise.all(segments.map(async (segment) => mapSegmentToTrackPlayerTrack({
      contentfulId: segment.contentfulId,
      title: segment.title,
      audioUrl: isOffline ? await getSafeFileUri(segment.audioUrl, meditationId, 'audio') : segment.audioUrl,
      duration: segment.duration,
      image: segment.image || image,
      teacher: segment.teacher || teacher,
    })))
  }

  useEffect(() => {
    (async () => {
      await TrackPlayer.reset()
      console.log('reset, adding tracks')

      // If segments contains an indefinite silent segment, only play
      // up to this segment
      const silentSegmentIndex = segments.findIndex((segment) => segment.type === 'Silent' && segment.isIndefinite)
      const filteredSegments = silentSegmentIndex !== -1 ? segments.slice(0, silentSegmentIndex) : segments

      // Flatten the silent segments to have an array to pass to getTracks
      const flattenedSegments = flattenSilentSegments(filteredSegments)

      const tracks = await getTracks(flattenedSegments, image, teacher)
      await TrackPlayer.add(tracks)
    })()
  }, [segments, image, teacher])

  useTrackPlayerEvents([Event.PlaybackState], ({ state }) => {
    if (state === State.Ready) {
      TrackPlayer.play()
    }
    setIsBuffering(state === State.Buffering)
    setIsLoaded(state !== State.Loading)
    setIsPlaying(state === State.Playing)
  })

  const { position } = useProgress()

  const activeTrack = useActiveTrack()
  const activeTrackIndex = useMemo(() => {
    return segments.findIndex((track) => track.contentfulId === activeTrack?.id)
  }, [activeTrack, segments])

  useEffect(() => {
    setPosition(getGlobalCurrentPosition(segments, position, activeTrackIndex).toFixed(0))
  }, [position, activeTrackIndex])

  useImperativeHandle(ref, () => ({
      play: TrackPlayer.play,
      pause: TrackPlayer.pause,
      stop: TrackPlayer.reset,
      seekTo: (position) => {
        const { index, positionInSegment } = mapPositionToSegment(segments, position)
        TrackPlayer.skip(index, positionInSegment)
      },
      seekBy: (seconds) => {
        const currentPosition = getGlobalCurrentPosition(segments, position, activeTrackIndex)
        const { index, positionInSegment } = mapPositionToSegment(segments, currentPosition + seconds)
        TrackPlayer.skip(index, positionInSegment)
      },
    }
  ))

  const orientation = useOrientation()
  return (
    <FadeView hidden={dimmed} style={styles.videoContainer}>
      <Image
        style={styles.image}
        source={{ uri: orientation === 'PORTRAIT' ? image.portraitUrl : image.landscapeUrl}}
      />
    </FadeView>
  )
})

const styles = StyleSheet.create({
  videoContainer: {
    width: '100%',
    height: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
})

export default AudioPlayback
