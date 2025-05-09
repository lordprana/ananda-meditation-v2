import { useLocalSearchParams, useNavigation } from 'expo-router'
import { useLayoutEffect } from 'react'
import MeditationGroup from '../../components/meditation-group/MeditationGroup'
import { useSelector } from 'react-redux'
import { selectItemByContentfulId } from '../../store/meditationLibrariesSlice'

const MeditationGroupScreen = () => {
  const {contentfulId} = useLocalSearchParams()
  const navigation = useNavigation()
  const group = useSelector(selectItemByContentfulId(contentfulId))

  useLayoutEffect(() => {
    navigation.setOptions({
      title: group.title
    })
  }, [navigation, group])
  return (
    <MeditationGroup group={group} />
  )
}

export default MeditationGroupScreen
