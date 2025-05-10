import { forwardRef, useEffect, useImperativeHandle } from 'react'
import FadeView from '../ui/FadeView'
import { StyleSheet } from 'react-native'
import { useVideoPlayer, VideoView } from 'expo-video'
import { getSafeFileUri } from '../../store/offlineMeditationStatusesSlice'

const VideoPlayback = forwardRef(({
                                    meditationId,
                                    isOffline,
                                    setPlaybackStatus,
                                    videoUrl,
                                    dimmed,
                                    setIsBuffering,
                                    setIsPlaying,
                                    setPosition,
                                    setIsLoaded,
                                  }, ref) => {
  const player = useVideoPlayer(null,
    player => {
      player.staysActiveInBackground = true
      player.timeUpdateEventInterval = 1
    })
  useEffect(() => {
    (async () => {
      const playbackUri = isOffline ?
        (await getSafeFileUri(videoUrl, meditationId, 'video')) :
        videoUrl
      console.log(playbackUri)
      player.replaceAsync({ uri: playbackUri })
    })()
  }, [player])

  useEffect(() => {
    const statusSubscription = player.addListener('statusChange', ({ status, error }) => {
      if (status === 'readyToPlay') {
        setIsLoaded(true)
        player.play()
      }
    })
    const isPlayingSubscription = player.addListener('playingChange', ({ isPlaying }) => {
      setIsPlaying(isPlaying)
    })
    const timeUpdateSubscription = player.addListener('timeUpdate', ({ currentTime, bufferedPosition }) => {
      console.log(currentTime, 'currentTime')
      setPosition(currentTime.toFixed(0))
      setIsBuffering(bufferedPosition === 0)
    })
    return () => {
      statusSubscription.remove()
      isPlayingSubscription.remove()
      timeUpdateSubscription.remove()
    }
  }, [player])
  useImperativeHandle(ref, () => ({
      play: () => player.play(),
      pause: () => player.pause(),
      seekTo: (position) => {
        player.currentTime = position
      },
      seekBy: (seconds) => player.seekBy(seconds),
      stop: () => player.pause(),
    }
  ))
  return (
    <FadeView hidden={dimmed} style={styles.videoContainer}>
      <VideoView
        style={styles.videoElement}
        player={player}
        contentFit={'contain'}
        nativeControls={false}
        allowsFullscreen
        allowsPictureInPicture
      />
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

export default VideoPlayback
