import { loadLegacyCustomMeditationsFromStorage, mapLegacyMeditationsToNewSchema } from './customMeditations'
import { deleteLegacyStorage, loadLegacyFavoritesFromStorage, mapLegacyFavoritesToNewSchema } from './favorites'
import { getDatabaseValue } from '../../logic/database'
import { setCustomMeditations } from '../meditationLibrariesSlice'
import { setFavorites } from '../favoriteMeditationsSlice'
import AsyncStorage from '@react-native-async-storage/async-storage'

export const loadedLegacyDataFromStorageKey = 'loadedLegacyDataFromStorage'
export const loadedLegacyDataFromDatabaseKey = 'loadedLegacyDataFromStorage'

export const fetchLegacyDataFromDatabase = async (getState) => {
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
  const loadedLegacyDataFromStorage = await AsyncStorage.getItem(loadedLegacyDataFromStorageKey)
  const loadedLegacyDataFromDatabase = await AsyncStorage.getItem(loadedLegacyDataFromDatabaseKey)
  const legacyDataFromStorage = loadedLegacyDataFromStorage ? await loadLegacyDataFromStorage(getState) : {}
  const legacyDataFromDatabase = loadedLegacyDataFromDatabase ? await fetchLegacyDataFromDatabase(getState) : {}
  // // const state = getState()
  //
  dispatch(setCustomMeditations([
  //   ...state.customMeditations,
    ...legacyDataFromStorage?.customMeditations || [],
    ...legacyDataFromDatabase?.customMeditations || [],
    ]))
  dispatch(setFavorites([
    // ...state.favorites,
    ...legacyDataFromStorage?.favorites || [],
    ...legacyDataFromDatabase?.favorites || [],
  ]))

}
