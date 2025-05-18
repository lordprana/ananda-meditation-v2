import AsyncStorage from '@react-native-async-storage/async-storage'
import { mapLegacyMeditationsToContentful, mapLocalLegacyMeditationsToContentful } from '../legacy/customMeditations'
import { DATABASE_PATHS, getDatabaseValue } from '../../logic/database'
import { setCustomMeditations } from '../meditationLibrariesSlice'

const CUSTOM_MEDITATION_STORAGE_KEY = 'customMeditations'

export const loadCustomMeditations = () => async (dispatch, getState) => {
  try {
    const customMeditations = JSON.parse(await AsyncStorage.getItem(CUSTOM_MEDITATION_STORAGE_KEY)) || []
    const legacyCustomMeditations = await mapLocalLegacyMeditationsToContentful(getState) // Legacy code should be removed on the next update of the app
    const remoteCustomMeditations = await loadCustomMeditationsFromDatabase(getState)
    const allCustomMeditations = [...customMeditations, ...legacyCustomMeditations, ...remoteCustomMeditations]
    dispatch(setCustomMeditations(allCustomMeditations))
  } catch (error) {
    console.error('Failed to load custom meditations:', error)
  }
}

export const loadCustomMeditationsFromDatabase = async (getState) => {
  try {
    const customMeditations = await getDatabaseValue(DATABASE_PATHS.customMeditations)
    const isLegacyFormat = !Array.isArray(customMeditations) // Legacy related code should be removed on the next update of the app
    if (!isLegacyFormat) { // The new data format is an array
      return customMeditations
    } else {
      return mapLegacyMeditationsToContentful(getState)
    }
  } catch (e) {
    console.warn('Failed to load favorites from database', e)
    return []
  }
}
