import { useLocalSearchParams } from 'expo-router'
import PickCustomMeditationImage from '../../components/create-custom-meditation/PickCustomMeditationImage'

const PickCustomMeditationImageScreen = () => {
  const {contentfulId} = useLocalSearchParams()
  return (
    <PickCustomMeditationImage customMeditationId={contentfulId}/>
  )
}

export default PickCustomMeditationImageScreen
