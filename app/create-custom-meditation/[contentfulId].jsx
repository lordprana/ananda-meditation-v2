import CreateOrEditCustomMeditation from '../../components/create-custom-meditation/CreateOrEditCustomMeditation'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useDispatch, useSelector } from 'react-redux'
import {
  addCustomMeditation,
  getNewCustomMeditation,
  selectCustomMeditationById,
} from '../../store/customMeditationsSlice'
import { useEffect } from 'react'

const CreateCustomMeditationScreen = () => {
  // If the contentfulId is 'newCustomMeditation', then we are creating a new custom meditation
  // it doesnt exist in the library, so we end up creating a new one.
  const { contentfulId } = useLocalSearchParams()
  const customMeditation = useSelector(selectCustomMeditationById(contentfulId))
  const router = useRouter()
  const dispatch = useDispatch()
  console.log(contentfulId, 'contentfulId')
  console.log(customMeditation, 'customeMeditation')

  // Redirect if this is a new custom meditation
  useEffect(() => {
    if (!customMeditation) {
      // If the customMeditation is null, then we are creating a new custom meditation
      // so we need to add it to the store
      const newMeditation = getNewCustomMeditation()
      dispatch(addCustomMeditation(newMeditation))
      router.replace(`create-custom-meditation/${newMeditation.contentfulId}`)
    }
  }, [])

  if (!customMeditation) {
    return null
  }

  return (
    <CreateOrEditCustomMeditation customMeditation={customMeditation} />
  )
}

export default CreateCustomMeditationScreen
