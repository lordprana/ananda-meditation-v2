import { forwardRef, useEffect, useImperativeHandle } from 'react'
import FadeView from '../ui/FadeView'
import { StyleSheet } from 'react-native'
import { useVideoPlayer, VideoView } from 'expo-video'

const VideoPlayback = forwardRef(({
                                    setPlaybackStatus,
                                    videoUrl,
                                    dimmed,
                                    setIsBuffering,
                                    setIsPlaying,
                                    setPosition,
                                    setIsLoaded,
                                  }, ref) => {
  const player = useVideoPlayer({
      uri: videoUrl,
    },
    player => {
      player.play()
    })
  useEffect(() => {
    setIsBuffering(player.bufferedPosition === 0)
  }, [player.bufferedPosition])
  useEffect(() => {
    setIsPlaying(player.playing)
  }, [player.playing])
  useEffect(() => {
    setPosition(player.currentTime)
  }, [player.currentTime])
  useEffect(() => {
    setIsLoaded(player.status === 'readyToPlay')
  }, [player.status])
  useImperativeHandle(ref, () => ({
      play: player.play,
      pause: player.pause,
      seekTo: (position) => {
        player.currentTime = position
      },
      seekBy: player.seekBy,
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
