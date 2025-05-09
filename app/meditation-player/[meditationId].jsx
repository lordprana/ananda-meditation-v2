import { useLocalSearchParams, useNavigation } from 'expo-router'
import { useLayoutEffect } from 'react'
import MeditationGroup from '../../components/meditation-group/MeditationGroup'
import { useSelector } from 'react-redux'
import { selectItemByContentfulId } from '../../store/meditationLibrariesSlice'
import MeditationPlayer from '../../components/meditation-player/MeditationPlayer'

const MeditationPlayerScreen = () => {
  const {meditationId} = useLocalSearchParams()
  const meditationIdDecoded = decodeURIComponent(meditationId)
  const meditation = useSelector(selectItemByContentfulId(meditationIdDecoded))

  return (
    <MeditationPlayer meditation={meditation} />
  )
}

export default MeditationPlayerScreen
