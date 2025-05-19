import CreateOrEditCustomMeditation from '../../components/create-custom-meditation/CreateOrEditCustomMeditation'
import { useLocalSearchParams, useNavigation } from 'expo-router'
import { useSelector } from 'react-redux'
import { selectItemByContentfulId } from '../../store/meditationLibrariesSlice'
import { selectCustomMeditationById } from '../../store/customMeditationsSlice'

const CreateCustomMeditationScreen = () => {
  // If the contentfulId is 'newCustomMeditation', then we are creating a new custom meditation
  // it doesnt exist in the library, so we end up creating a new one.
  const {contentfulId} = useLocalSearchParams()
  const customMeditation = useSelector(selectCustomMeditationById(contentfulId))
  return (
    <CreateOrEditCustomMeditation customMeditation={customMeditation}/>
  )
}

export default CreateCustomMeditationScreen
