import { StyleSheet, TouchableOpacity } from 'react-native'
import { useMemo, useRef, useState } from 'react'
// import VideoPlayback from './VideoPlayback'
import PlayerHeader from './PlayerHeader'
import PlayerControls from './PlayerControls'
import { getMeditationDuration } from '../../store/meditationLibrariesSlice'
import PositionLabel from './PositionLabel'
import AudioPlayback from './AudioPlayback'
import { useSelector } from 'react-redux'
import { selectIsDisabledVideoMeditation } from '../../store/disabledVideoMeditationsSlice'
import VideoPlayback from './VideoPlayback'

const MeditationPlayer = ({ meditation }) => {
  const { videoUrl, segments, title } = meditation
  const duration = useMemo(() => getMeditationDuration(meditation), [meditation])
  const videoDisabled = useSelector(selectIsDisabledVideoMeditation(meditation.contentfulId))
  console.log('videoDisabled', videoDisabled)
  const audioOnly = videoDisabled || !videoUrl

  const [controlsHidden, setControlsHidden] = useState(false)
  const [backgroundDimmed, setBackgroundDimmed] = useState(false)

  const [position, setPosition] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isBuffering, setIsBuffering] = useState(false)

  const videoRef = useRef(null)
  const audioRef = useRef(null)
  const playbackRef = audioOnly ? audioRef : videoRef

  const toggleControlsHidden = () => {
    if (isPlaying) {
      setControlsHidden(!controlsHidden)
    } else {
      setControlsHidden(false)
    }
  }
  const togglePlay = () => {
    if (isPlaying) {
      playbackRef.current.pause()
    } else {
      playbackRef.current.play()
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
        onBack={() => playbackRef.current.stop()}
      />
      {!audioOnly && <VideoPlayback
        ref={videoRef}
        videoUrl={videoUrl}
        dimmed={backgroundDimmed}
        setPosition={setPosition}
        setIsPlaying={setIsPlaying}
        setIsLoaded={setIsLoaded}
        setIsBuffering={setIsBuffering}
      />}
      {audioOnly && <AudioPlayback
        ref={audioRef}
        segments={segments}
        dimmed={backgroundDimmed}
        setPosition={setPosition}
        setIsPlaying={setIsPlaying}
        setIsLoaded={setIsLoaded}
        setIsBuffering={setIsBuffering}
      />}
      <PlayerControls
        hidden={controlsHidden}
        togglePlay={togglePlay}
        toggleDim={toggleDim}
        forwardTen={() => playbackRef.current.seekBy(10)}
        backTen={() => playbackRef.current.seekBy(-10)}
        seekTo={(seconds) => playbackRef.current.seekTo(seconds)}
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
