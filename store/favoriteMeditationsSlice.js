// /store/favoriteMeditationsSlice.js
import { createSlice } from '@reduxjs/toolkit'
import AsyncStorage from '@react-native-async-storage/async-storage'
// import { store } from '@/store/store'
import { DATABASE_PATHS, getDatabaseValue, setDatabaseValue } from '@/logic/database'
import {
  mapLegacyMeditationIdToContentfulMeditation,
  mapLocalLegacyFavoritesToContentful,
} from '@/store/legacy/favorites'
import { dedupeWithComparator } from '@/util'

const STORAGE_KEY = 'favoriteMeditations'

export const selectIsFavoriteMeditation = (id) => (state) => state.favoriteMeditations.includes(id)
export const selectFavoriteMeditationIds = (state => state.favoriteMeditations)

const favoriteMeditationsSlice = createSlice({
  name: 'favoriteMeditations',
  initialState: [], // array of meditation IDs
  reducers: {
    toggleFavorite: (state, action) => {
      const id = action.payload
      const index = state.indexOf(id)
      if (index === -1) {
        state.push(id)
      } else {
        state.splice(index, 1)
      }
    },
    setFavorites: (state, action) => {
      const dedupedFavorites = dedupeWithComparator(action.payload, (b) => (a) => a === b)
      return dedupedFavorites
    },
  },
})
export const { toggleFavorite, setFavorites } = favoriteMeditationsSlice.actions

export const toggleFavoriteAsync = (id) => async (dispatch, getState) => {
  dispatch(toggleFavorite(id))
  try {
    const updated = getState().favoriteMeditations
    await updateFavoritesStorage(updated)
  } catch (e) {
    console.warn('Failed to persist favorite changes', e)
  }
}

export const updateFavoritesStorage = async (newFavorites) => {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newFavorites))
  await setDatabaseValue(DATABASE_PATHS.favorites, newFavorites)

}


// Meditation library must first be loaded to do mapping from legacy
// favorites to current library
export const loadFavorites = () => async (dispatch, getState) => {
  const storageFavorites = JSON.parse((await AsyncStorage.getItem(STORAGE_KEY)) || '[]')
  const databaseFavorites = await loadFavoritesFromDatabase(getState)

  const allFavorites = dedupeWithComparator(
    [
      ...storageFavorites,
      ...databaseFavorites,
    ], (a) => (b) => a === b)

  dispatch(setFavorites(allFavorites))
  await updateFavoritesStorage(allFavorites)
}

export const loadFavoritesFromDatabase = async (getState) => {
  try {
    const favoriteMeditations = await getDatabaseValue(DATABASE_PATHS.favorites)
    const isLegacyFormat = !Array.isArray(favoriteMeditations) // Legacy related code should be removed on the next version of the app
    return !isLegacyFormat ?
      favoriteMeditations :
      favoriteMeditations?.keys?.map((meditationId) => mapLegacyMeditationIdToContentfulMeditation(meditationId, getState)?.contentfulId) || []
  } catch (e) {
    console.warn('Failed to load favorites from database', e)
    return []
  }
}

export default favoriteMeditationsSlice.reducer




