import { useLocalSearchParams, useNavigation } from 'expo-router'
import { useLayoutEffect } from 'react'
import MeditationGroup from '../../components/meditation-group/MeditationGroup'

const MeditationGroupScreen = () => {
  const {groupName} = useLocalSearchParams()
  const navigation = useNavigation()
  const groupNameDecoded = decodeURIComponent(groupName)

  useLayoutEffect(() => {
    navigation.setOptions({
      title: groupNameDecoded
    })
  }, [navigation, groupName])
  return (
    <MeditationGroup groupName={groupNameDecoded} />
  )
}

export default MeditationGroupScreen
