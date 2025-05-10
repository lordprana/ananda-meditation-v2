import { StyleSheet, TouchableOpacity } from 'react-native'
import { useMemo, useRef, useState } from 'react'
import VideoPlayback from './VideoPlayback'
import PlayerHeader from './PlayerHeader'
import PlayerControls from './PlayerControls'
import { getMeditationDuration } from '../../store/meditationLibrariesSlice'
import PositionLabel from './PositionLabel'

const MeditationPlayer = ({ meditation }) => {
  const { videoUrl, segments, title } = meditation
  const duration = useMemo(() => getMeditationDuration(meditation) , [meditation])
  const [controlsHidden, setControlsHidden] = useState(false)
  const [backgroundDimmed, setBackgroundDimmed] = useState(false)

  const [position, setPosition] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isBuffering, setIsBuffering] = useState(false)

  const videoRef = useRef(null)

  const toggleControlsHidden = () => {
    if (isPlaying) {
      setControlsHidden(!controlsHidden)
    } else {
      setControlsHidden(false)
    }
  }
  const togglePlay = () => {
    if (isPlaying) {
      videoRef.current.pause()
    } else {
      videoRef.current.play()
    }
  }
  const toggleDim = () => {
    setBackgroundDimmed(!backgroundDimmed)
    setControlsHidden(!backgroundDimmed)
  }
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
          videoUrl={videoUrl}
          dimmed={backgroundDimmed}
          setPosition={setPosition}
          setIsPlaying={setIsPlaying}
          setIsLoaded={setIsLoaded}
          setIsBuffering={setIsBuffering}
        />}
        {/*{ !videoUrl && <AudioPlayback/> }*/}
        <PlayerControls
          hidden={controlsHidden}
          togglePlay={togglePlay}
          toggleDim={toggleDim}
          forwardTen={() => videoRef.current.seekBy(10)}
          backTen={() => videoRef.current.seekBy(-10)}
          seekTo={(seconds) => videoRef.current.seekTo(seconds)}
          isPlaying={isPlaying}
          isBackgroundDimmed={backgroundDimmed}
          currentPosition={position}
          mediaLoaded={isLoaded && !isBuffering}
          duration={duration}
        />
        <PositionLabel
          segments={segments}
          currentPosition={position}
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
