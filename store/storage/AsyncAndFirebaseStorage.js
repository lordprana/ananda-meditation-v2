import AsyncStorage from '@react-native-async-storage/async-storage'
import { getDatabaseValue, setDatabaseValue } from '@/logic/database'
import { dedupeWithComparator } from '@/util'
import { favoritesDedupeFunction } from '@/store/favoriteMeditationsSlice'
import { disabledVideoDedupeFunction } from '@/store/disabledVideoMeditationsSlice'
import { customMeditationsDedupeFunction } from '@/store/customMeditationsSlice'

export const reduxPersistKey = 'root'


export const AsyncAndFirebaseStorage = {
  getItem: async (key) => {
    const storage = JSON.parse(await AsyncStorage.getItem(key))
    if (!storage) return null

    const database = JSON.parse(await getDatabaseValue(''))

    // Utility function for dealing with the way redux-persist stringifies values
    const mergeAndStringify = (key, dedupeFn) => {
      const parseSafely = (value) => JSON.parse(value || '[]')
      const merged = dedupeWithComparator([
        ...parseSafely(storage[key]),
        ...parseSafely(database?.[key]),
      ], dedupeFn)

      return JSON.stringify(merged)
    }

    const rehydratedState = JSON.stringify({
      favoriteMeditations: mergeAndStringify('favoriteMeditations', favoritesDedupeFunction),
      disabledVideoMeditations: mergeAndStringify('disabledVideoMeditations', disabledVideoDedupeFunction),
      customMeditations: mergeAndStringify('customMeditations', customMeditationsDedupeFunction),
      offlineMeditationStatuses: storage.offlineMeditationStatuses,
      user: storage.user || database?.user,
    })

    return rehydratedState
  },

  setItem: async (key, data) => {
    await AsyncStorage.setItem(key, data)
    setDatabaseValue('', data) // Do not await, as this slows down the UI too much
  },

  removeItem: async (key) => {
    await AsyncStorage.removeItem(key)
    await setDatabaseValue('', null)
  },
}
