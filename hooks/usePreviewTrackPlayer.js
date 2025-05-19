import { useEffect, useState } from 'react'
import { mapSegmentToTrackPlayerTrack } from '../components/meditation-player/AudioPlayback'
import TrackPlayer, { Event, State, useTrackPlayerEvents } from 'react-native-track-player'
import { useIsFocused } from '@react-navigation/native'

export const usePreviewTrackPlayer = () => {
  const [hasLoaded, setHasLoaded] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  const [activePreviewSegment, setActivePreviewSegment] = useState(null)
  const playSegmentPreview = async (segment) => {
    if (!hasLoaded || activePreviewSegment !== segment.contentfulId) {
      const tracks = [mapSegmentToTrackPlayerTrack(segment)]
      await TrackPlayer.reset()
      await TrackPlayer.add(tracks)
    } else {
      await TrackPlayer.play()
    }
    setIsPlaying(true)
    setActivePreviewSegment(segment.contentfulId)
  }
  const pauseSegmentPreview = async () => {
    await TrackPlayer.pause()
    setIsPlaying(false)
  }

  // Pause and reset the player when the screen is not focused
  const isFocused = useIsFocused()
  useEffect(() => {
    (async () => {
      if (!isFocused) {
        await pauseSegmentPreview()
        await TrackPlayer.reset()
      }
    })()
  }, [isFocused])

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

  return {
    playSegmentPreview,
    pauseSegmentPreview,
    isPlaying,
    hasLoaded,
    activePreviewSegment,
  }
}
