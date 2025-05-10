import { TouchableOpacity, StyleSheet, SafeAreaView, TouchableWithoutFeedback, View } from 'react-native'
import { useMemo, useRef, useState } from 'react'
import VideoPlayback from './VideoPlayback'
import PlayerHeader from './PlayerHeader'
import PlayerControls from './PlayerControls'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { getMeditationDuration } from '../../store/meditationLibrariesSlice'
import PositionLabel from './PositionLabel'

const MeditationPlayer = ({ meditation }) => {
  const { videoUrl, segments, title } = meditation
  const duration = useMemo(() => getMeditationDuration(meditation) , [meditation])
  const [playbackStatus, setPlaybackStatus] = useState({})
  const [controlsHidden, setControlsHidden] = useState(false)
  const [backgroundDimmed, setBackgroundDimmed] = useState(false)
  const [mediaLoaded, setMediaLoaded] = useState(false)
  const videoRef = useRef(null)
  const insets = useSafeAreaInsets()

  const toggleControlsHidden = () => {
    if (playbackStatus.isPlaying) {
      setControlsHidden(!controlsHidden)
    } else {
      setControlsHidden(false)
    }
  }
  const togglePlay = () => {
    if (playbackStatus.isPlaying) {
      videoRef.current.pauseAsync()
    } else {
      videoRef.current.playAsync()
    }
  }
  const toggleDim = () => {
    setBackgroundDimmed(!backgroundDimmed)
    setControlsHidden(!backgroundDimmed)
  }
  const seekBy = async (seconds) => {
    const currentPos = playbackStatus.positionMillis || 0;
    await videoRef.current.setPositionAsync(currentPos + seconds * 1000);
  };
  return (
      <TouchableOpacity
        style={[styles.outerContainer]}
        onPress={toggleControlsHidden}
        activeOpacity={1}
      >
        <PlayerHeader
          title={title}
          hidden={controlsHidden}
        />
        {videoUrl && <VideoPlayback
          ref={videoRef}
          setPlaybackStatus={setPlaybackStatus}
          videoUrl={videoUrl}
          dimmed={backgroundDimmed}
          setMediaLoaded={setMediaLoaded}
        />}
        {/*{ !videoUrl && <AudioPlayback/> }*/}
        <PlayerControls
          hidden={controlsHidden}
          togglePlay={togglePlay}
          toggleDim={toggleDim}
          forwardTen={() => seekBy(10)}
          backTen={() => seekBy(-10)}
          seekTo={(seconds) => videoRef.current.setPositionAsync(seconds * 1000)}
          isPlaying={playbackStatus.isPlaying}
          isBackgroundDimmed={backgroundDimmed}
          currentPosition={playbackStatus.positionMillis / 1000}
          mediaLoaded={playbackStatus.isLoaded && !playbackStatus.isBuffering}
          duration={duration}
        />
        <PositionLabel
          segments={segments}
          currentPosition={(playbackStatus.positionMillis / 1000).toFixed(0)}
          duration={duration}
        />
      </TouchableOpacity>
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
