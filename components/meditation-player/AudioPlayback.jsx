import { forwardRef } from 'react'
import { Video } from 'expo-av'
import FadeView from '../ui/FadeView'
import { StyleSheet } from 'react-native'

const AudioPlayback = forwardRef(({
                                    setPlaybackStatus,
                                    videoUrl,
                                    dimmed,
                                  }, ref) => {
  return (
    <FadeView hidden={dimmed} style={styles.audioContainer}>
      <Video
        ref={ref}
        source={{ uri: videoUrl }}
        style={styles.videoElement}
        useNativeControls={false}
        resizeMode={'contain'}
        onPlaybackStatusUpdate={setPlaybackStatus}
        shouldPlay={true}
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

export default AudioPlayback
