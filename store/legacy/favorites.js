import AsyncStorage from '@react-native-async-storage/async-storage'
import legacyMeditations from './data/legacyMeditations'
import { selectLibraryItemByCallback } from '../meditationLibrariesSlice'

const legacyStorageKey = 'root'
export const loadLegacyStorage = async () => {
  try {
    const legacyReduxStore = await AsyncStorage.getItem(legacyStorageKey)
    if (!legacyReduxStore) return null

    const parsedState = JSON.parse(legacyReduxStore)

    return parsedState
  } catch (error) {
    console.error('Failed to load legacy custom sessions:', error)
    return null
  }
}

export const deleteLegacyStorage = async () => {
  try {
    await AsyncStorage.removeItem(legacyStorageKey)
  } catch (error) {
    console.error('Failed to delete legacy custom sessions:', error)
  }
}

export const loadLegacyFavoritesFromStorage = async () => {
  const legacyReduxStore = await loadLegacyStorage()
  const favouriteSessions = legacyReduxStore?.firebaseReducer?.favouriteSessions
  return favouriteSessions || { keys: [] }
}

export const mapLegacyFavoritesToNewSchema = (legacyFavorites, getState) => {
  const favorites = legacyFavorites.keys || []
  return favorites.map((legacyId) => mapLegacyMeditationIdToContentfulMeditationId(legacyId, getState))
}

export const mapLegacyMeditationIdToContentfulMeditationId = (legacyId, getState) => {
  const legacyMeditation = legacyMeditations[legacyId]
  const legacyMeditationSequenceLength = legacyMeditation?.audioOnlySequence?.length || legacyMeditation?.sequence?.length
  // If a piece of content has the same title and sequence length as a legacy meditation, return it
  const meditation = selectLibraryItemByCallback((item) => {
    return legacyMeditation && item.title === legacyMeditation.title && legacyMeditationSequenceLength === item.sequence?.length
  })(getState())

  return meditation.contentfulId
}
