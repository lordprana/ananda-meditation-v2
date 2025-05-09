import { useLocalSearchParams, useNavigation } from 'expo-router'
import { useLayoutEffect } from 'react'
import MeditationGroup from '../../components/meditation-group/MeditationGroup'

const MeditationGroupScreen = () => {
  const {groupTitle} = useLocalSearchParams()
  const navigation = useNavigation()
  const groupTitleDecoded = decodeURIComponent(groupTitle)

  useLayoutEffect(() => {
    navigation.setOptions({
      title: groupTitleDecoded
    })
  }, [navigation, groupTitle])
  return (
    <MeditationGroup groupTitle={groupTitleDecoded} />
  )
}

export default MeditationGroupScreen
