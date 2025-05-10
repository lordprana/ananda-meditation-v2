import { forwardRef } from 'react'
import { Video } from 'expo-av'
import FadeView from '../ui/FadeView'
import { StyleSheet } from 'react-native'

const VideoPlayback = forwardRef(({ setPlaybackStatus, videoUrl, dimmed, setMediaLoaded }, ref) => {
  console.log(dimmed, 'dimmed')
  return (
    <FadeView hidden={dimmed} style={styles.videoContainer}>
      <Video
        ref={ref}
        source={{ uri: videoUrl }}
        style={styles.videoElement}
        useNativeControls={false}
        resizeMode={'contain'}
        onPlaybackStatusUpdate={setPlaybackStatus}
        shouldPlay={true}
        onLoad={() => setMediaLoaded(true)}
      />
    </FadeView>
  )
})

const styles = StyleSheet.create({
  videoContainer: {
    width: '100%',
    height: '100%',
  },
  videoElement:{
    flex: 1
  }
})

export default VideoPlayback
