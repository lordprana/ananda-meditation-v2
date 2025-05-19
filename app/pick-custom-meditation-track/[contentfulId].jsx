import PickCustomMeditationTrack from '../../components/create-custom-meditation/PickCustomMeditationTrack'
import { useLocalSearchParams } from 'expo-router'
import { useSelector } from 'react-redux'
import { selectCustomMeditationById } from '../../store/customMeditationsSlice'

const PickCustomMeditationTrackScreen = () => {
  const {contentfulId} = useLocalSearchParams()
  const customMeditation = useSelector(selectCustomMeditationById(contentfulId))
  return (
    <PickCustomMeditationTrack customMeditation={customMeditation}/>
  )
}

export default PickCustomMeditationTrackScreen
