import { TouchableOpacity, StyleSheet, SafeAreaView, TouchableWithoutFeedback, View } from 'react-native'
import { useRef, useState } from 'react'
import VideoPlayback from './VideoPlayback'
import PlayerHeader from './PlayerHeader'

const MeditationPlayer = ({ meditation }) => {
  const { videoUrl, segments, title } = meditation
  const [playbackStatus, setPlaybackStatus] = useState({})
  const [controlsHidden, setControlsHidden] = useState(false)
  const videoRef = useRef(null)

  const toggleControlsHidden = () => {
    if (playbackStatus.isPlaying) {
      setControlsHidden(!controlsHidden)
    } else {
      setControlsHidden(false)
    }
  }
  return (
    <SafeAreaView style={styles.outerContainer}>
      <TouchableOpacity
        style={styles.outerContainer}
        onPress={toggleControlsHidden}
        activeOpacity={1}
      >
        <PlayerHeader
          title={title}
          hidden={controlsHidden}
        />
        {videoUrl && <VideoPlayback setPlaybackStatus={setPlaybackStatus} videoUrl={videoUrl} />}
        {/*{ !videoUrl && <AudioPlayback/> }*/}
        <PlayerControls/>
        {/*<PositionLabel/>*/}
      </TouchableOpacity>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  outerContainer: {
    backgroundColor: '#000',
    flex: 1,
  },
  touchableContainer: {
    flex: 1,
  },
})

export default MeditationPlayer
