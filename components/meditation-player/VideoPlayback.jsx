import { forwardRef } from 'react'
import { Video } from 'expo-av'

const VideoPlayback = forwardRef(({ setPlaybackStatus, videoUrl }, ref) => {
  return (
    <Video
      ref={ref}
      style={{ width: '100%', height: '100%' }}
      source={{ uri: videoUrl }}
      useNativeControls={false}
      resizeMode={'contain'}
      onPlaybackStatusUpdate={setPlaybackStatus}
      shouldPlay={true}
    />
  )
})

export default VideoPlayback
