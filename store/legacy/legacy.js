import { loadLegacyCustomMeditationsFromStorage, mapLegacyMeditationsToNewSchema } from './customMeditations'
import { deleteLegacyStorage, loadLegacyFavoritesFromStorage, mapLegacyFavoritesToNewSchema } from './favorites'
import { getDatabaseValue } from '../../logic/database'
import { setCustomMeditations } from '../meditationLibrariesSlice'
import { setFavorites } from '../favoriteMeditationsSlice'
import AsyncStorage from '@react-native-async-storage/async-storage'

const loadedLegacyDataFromStorageKey = 'loadedLegacyDataFromStorage'
const loadedLegacyDataFromDatabaseKey = 'loadedLegacyDataFromStorage'

const fetchLegacyDataFromDatabase = async (getState) => {
  const userObject = getDatabaseValue('') // Empty path returns the full user object
  if (
    userObject.customSessions ||
    userObject.favourites ||
    userObject.logs
  ) {
    console.log('Remote data contains legacy data schema')
    await AsyncStorage.setItem(loadedLegacyDataFromDatabaseKey, 'true')
    return {
      customMeditations: (await mapLegacyMeditationsToNewSchema(userObject.customSessions || [], getState)),
      favorites: mapLegacyFavoritesToNewSchema(userObject.favourites || [], getState),
      // logs,
    }

    console.warn('No legacy remote data found')
    return {}
  }
}

const loadLegacyDataFromStorage = async (getState) => {
  const customMeditations = await loadLegacyCustomMeditationsFromStorage()
  const favorites = await loadLegacyFavoritesFromStorage()
  await AsyncStorage.setItem(loadedLegacyDataFromStorageKey, 'true')
  await deleteLegacyStorage()
  return {
    customMeditations: (await mapLegacyMeditationsToNewSchema(customMeditations, getState)),
    favorites: mapLegacyFavoritesToNewSchema(favorites, getState),
  }
}


export const loadLegacyData = () => async (dispatch, getState) => {
  const legacyDataFromDatabase = await fetchLegacyDataFromDatabase(getState)
  const legacyDataFromStorage = await loadLegacyDataFromStorage(getState)

  dispatch(setCustomMeditations([
    ...legacyDataFromStorage.customMeditations,
    ...legacyDataFromDatabase.customMeditations,
    ]))
  dispatch(setFavorites([
    ...legacyDataFromStorage.favorites,
    ...legacyDataFromDatabase.favorites,
  ]))

}
