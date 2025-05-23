import { StyleSheet, TouchableOpacity } from 'react-native'
import { useEffect, useMemo, useRef, useState } from 'react'
// import VideoPlayback from './VideoPlayback'
import PlayerHeader from './PlayerHeader'
import PlayerControls from './PlayerControls'
import { getMeditationDuration } from '../../store/meditationLibrariesSlice'
import PositionLabel from './PositionLabel'
import AudioPlayback, { flattenSilentSegments } from './AudioPlayback'
import { useDispatch, useSelector } from 'react-redux'
import { selectIsDisabledVideoMeditation } from '../../store/disabledVideoMeditationsSlice'
import VideoPlayback from './VideoPlayback'
import { selectOfflineMeditationStatus } from '../../store/offlineMeditationStatusesSlice'
import { useOrientation } from '../../hooks/useOrientation'
import { updateLog } from '../../store/meditationLogsSlice'
import { useRouter } from 'expo-router'

const MeditationPlayer = ({ meditation }) => {
  const { videoUrl, segments, title } = meditation
  // We must flatten the silent segments to have proper functionality
  const flattenedSegments = useMemo(() => flattenSilentSegments(segments), [segments])
  const duration = useMemo(() => getMeditationDuration(meditation), [meditation])
  const videoDisabled = useSelector(selectIsDisabledVideoMeditation(meditation.contentfulId))
  const offlineMeditationStatus = useSelector(selectOfflineMeditationStatus(meditation.contentfulId))
  const isOffline = offlineMeditationStatus === 'completed'
  const isIndefiniteMeditation = useMemo(() => {
    return !!meditation.segments.find((segment) => segment.isIndefinite === true)
  }, [meditation])

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

  const dispatch = useDispatch()
  const router = useRouter()
  const onFinish = () => {
    const timestamp = Date.now() / 1000
    const meditationLog = {
      timestamp,
      duration: position,
      journalEntry: '',
      isManualLog: false,
    }
    dispatch(updateLog(meditationLog))
    router.replace(`/add-log/${timestamp}`)
  }
  useEffect(() => {
    if (position === duration) {
      onFinish()
    }
  }, [position, duration])
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
        meditationId={meditation.contentfulId}
        isOffline={isOffline}
        ref={videoRef}
        videoUrl={videoUrl}
        dimmed={backgroundDimmed}
        setPosition={setPosition}
        setIsPlaying={setIsPlaying}
        setIsLoaded={setIsLoaded}
        setIsBuffering={setIsBuffering}
      />}
      {audioOnly && <AudioPlayback
        meditationId={meditation.contentfulId}
        image={meditation.image}
        isOffline={isOffline}
        ref={audioRef}
        segments={flattenedSegments}
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
        isIndefiniteMeditation={isIndefiniteMeditation}
        onFinish={onFinish}
      />
      <PositionLabel
        segments={flattenedSegments}
        currentPosition={position}
        duration={duration}
        countUpFromBeginning={isIndefiniteMeditation}
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
