import AsyncStorage from '@react-native-async-storage/async-storage'
import legacyMeditations from './data/legacyMeditations'
import { selectLibraryItemByCallback } from '../meditationLibrariesSlice'

export const loadLegacyStorage = async () => {
  try {
    const legacyReduxStore = await AsyncStorage.getItem('root')
    if (!legacyReduxStore) return null

    const parsedState = JSON.parse(legacyReduxStore)

    return parsedState
  } catch (error) {
    console.error('Failed to load legacy custom sessions:', error)
    return null
  }
}

const getLocalLegacyFavorites = async () => {
  const legacyReduxStore = await loadLegacyStorage()
  const favouriteSessions = legacyReduxStore?.firebaseReducer?.favouriteSessions
  console.log(favouriteSessions?.keys || [])
  return favouriteSessions?.keys || []
}

export const mapLocalLegacyFavoritesToContentful = async (getState) => {
  return (await getLocalLegacyFavorites()).map((key) => mapLegacyMeditationIdToContentfulMeditation(key, getState))
}

export const mapLegacyMeditationIdToContentfulMeditation = (legacyId, getState) => {
  const legacyMeditation = legacyMeditations[legacyId]
  const legacyMeditationSequenceLength = legacyMeditation?.audioOnlySequence?.length || legacyMeditation?.sequence?.length
  // If a piece of content has the same title and sequence length as a legacy meditation, return it
  const meditation = selectLibraryItemByCallback((item) => {
    return legacyMeditation && item.title === legacyMeditation.title && legacyMeditationSequenceLength === item.sequence?.length
  })(getState())

  return meditation
}
