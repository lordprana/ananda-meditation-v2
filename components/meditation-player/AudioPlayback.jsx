import { forwardRef, useEffect, useImperativeHandle, useMemo } from 'react'
import FadeView from '../ui/FadeView'
import { StyleSheet } from 'react-native'
import TrackPlayer, { useTrackPlayerEvents, Event, State, useProgress, useActiveTrack } from 'react-native-track-player'

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

const AudioPlayback = forwardRef(({
                                    setPlaybackStatus,
                                    segments,
                                    thumbnailUrl, // Shown in system player
                                    teacher,
                                    dimmed,
                                    setIsBuffering,
                                    setIsPlaying,
                                    setPosition,
                                    setIsLoaded,
                                  }, ref) => {
  console.log('segments')
  console.log(segments)
  const tracks = useMemo(() => {
    return segments.map((segment) => ({
      id: segment.contentfulId,
      title: segment.title,
      url: segment.audioUrl,
      duration: segment.duration,
      artwork: segment.thumbnailUrl || thumbnailUrl,
      artist: segment.teacher || teacher,
    }))
  }, [segments, thumbnailUrl])

  useEffect(() => {
    (async () => {
      await TrackPlayer.reset()
      console.log('reset, adding tracks')
      await TrackPlayer.add(tracks)
      console.log('added tracks')
    })()
  }, [tracks])

  useTrackPlayerEvents([Event.PlaybackState], ({ state }) => {
    console.log('track player event')
    console.log(state)
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
    return tracks.findIndex((track) => track.id === activeTrack?.id)
  }, [activeTrack, tracks])

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
  return (
    <FadeView hidden={dimmed} style={styles.videoContainer}>
      {/*<VideoView*/}
      {/*  style={styles.videoElement}*/}
      {/*  player={player}*/}
      {/*  contentFit={'contain'}*/}
      {/*  nativeControls={false}*/}
      {/*  allowsFullscreen*/}
      {/*  allowsPictureInPicture*/}
      {/*/>*/}
    </FadeView>
  )
})

const styles = StyleSheet.create({
  videoContainer: {
    width: '100%',
    height: '100%',
  },
  videoElement: {
    flex: 1,
  },
})

export default AudioPlayback
