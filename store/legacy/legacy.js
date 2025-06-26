import { loadLegacyCustomMeditationsFromStorage, mapLegacyMeditationsToNewSchema } from './customMeditations'
import { deleteLegacyStorage, loadLegacyFavoritesFromStorage, mapLegacyFavoritesToNewSchema } from './favorites'
import { getDatabaseValue } from '../../logic/database'
import { setCustomMeditations } from '../customMeditationsSlice'
import { setFavorites } from '../favoriteMeditationsSlice'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { loadLegacyLogsFromStorage, mapLegacyLogsToNewSchema } from '@/store/legacy/logs'
import { setLogs } from '@/store/meditationLogsSlice'

export const loadedLegacyDataFromStorageKey = 'loadedLegacyDataFromStorage'
export const loadedLegacyDataFromDatabaseKey = 'loadedLegacyDataFromStorage'

export const fetchLegacyDataFromDatabase = async (getState) => {
  const userObject = await getDatabaseValue('') // Empty path returns the full user object
  if (
    userObject.customSessions ||
    userObject.favourites ||
    userObject.logs
  ) {
    console.log('Remote data contains legacy data schema')
    await AsyncStorage.setItem(loadedLegacyDataFromDatabaseKey, 'true')
    return {
      customMeditations: (await mapLegacyMeditationsToNewSchema(userObject.customSessions || [], getState)),
      favoriteMeditations: mapLegacyFavoritesToNewSchema(userObject.favourites || [], getState),
      logs: mapLegacyLogsToNewSchema(userObject.logs || [], getState),
    }
  } else {
    console.warn('No legacy remote data found')
    return {}
  }
}

const loadLegacyDataFromStorage = async (getState) => {
  const customMeditations = await loadLegacyCustomMeditationsFromStorage()
  const favorites = await loadLegacyFavoritesFromStorage()
  const logs = await loadLegacyLogsFromStorage()
  await AsyncStorage.setItem(loadedLegacyDataFromStorageKey, 'true')
  await deleteLegacyStorage()
  return {
    customMeditations: (await mapLegacyMeditationsToNewSchema(customMeditations, getState)),
    favoriteMeditations: mapLegacyFavoritesToNewSchema(favorites, getState),
    logs: mapLegacyLogsToNewSchema(logs, getState),
  }
}


export const loadLegacyData = () => async (dispatch, getState) => {
  const loadedLegacyDataFromStorage = await AsyncStorage.getItem(loadedLegacyDataFromStorageKey)
  const loadedLegacyDataFromDatabase = await AsyncStorage.getItem(loadedLegacyDataFromDatabaseKey)
  const legacyDataFromStorage = loadedLegacyDataFromStorage ? await loadLegacyDataFromStorage(getState) : {}
  const legacyDataFromDatabase = loadedLegacyDataFromDatabase ? await fetchLegacyDataFromDatabase(getState) : {}
  const state = getState()

  dispatch(setCustomMeditations([
    ...state.customMeditations,
    ...(legacyDataFromStorage?.customMeditations || []),
    ...(legacyDataFromDatabase?.customMeditations || []),
  ]))
  dispatch(setFavorites([
    ...state.favoriteMeditations,
    ...(legacyDataFromStorage?.favoriteMeditations || []),
    ...(legacyDataFromDatabase?.favoriteMeditations || []),
  ]))
  dispatch(setLogs([
    ...state.meditationLogs,
    ...(legacyDataFromStorage?.logs || []),
    ...(legacyDataFromDatabase?.logs || []),
  ]))
}
