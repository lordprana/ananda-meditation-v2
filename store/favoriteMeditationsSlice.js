// /store/favoriteMeditationsSlice.js
import { createSlice } from '@reduxjs/toolkit'
import AsyncStorage from '@react-native-async-storage/async-storage'
import auth from '@react-native-firebase/auth'
import database from '@react-native-firebase/database'
import { stripUidSymbols } from '@/util'
// import { store } from '@/store/store'
import { selectLibraryItemByCallback } from '@/store/meditationLibrariesSlice'
import legacyMeditations from '@/legacy-data/legacyMeditations'
import { DATABASE_PATHS, getDatabaseValue, onDatabaseValue, setDatabaseValue } from '@/logic/database'

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
      return action.payload
    },
  },
})
const { toggleFavorite, setFavorites } = favoriteMeditationsSlice.actions

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
  await setDatabaseValue(DATABASE_PATHS.favorites, {
    keys: newFavorites,
  })

}


// Meditation library must first be loaded to do mapping from legacy
// favorites to current library
const dedupe = (arr) => arr.reduce((acc, item) => acc.includes(item) ? acc : [...acc, item], [])
export const loadFavorites = () => async (dispatch, getState) => {
  const storageFavorites = JSON.parse((await AsyncStorage.getItem(STORAGE_KEY)) || '[]')
  const legacyFavorites = await mapLocalLegacyFavoritesToContentful(getState)
  const databaseFavorites = await loadFavoritesFromDatabase(getState)

  const allFavorites = dedupe([...storageFavorites, ...databaseFavorites, ...legacyFavorites])

  dispatch(setFavorites(allFavorites))
  await updateFavoritesStorage(allFavorites)
}

export const loadFavoritesFromDatabase = async (getState) => {
  try {
    const favoriteMeditations = await getDatabaseValue(DATABASE_PATHS.favorites)
    return favoriteMeditations?.keys?.map((meditationId) => mapLegacyMeditationIdToContentfulMeditation(meditationId, getState)?.contentfulId)
      || []
  } catch (e) {
    console.warn('Failed to load favorites from database', e)
    return []
  }
}
const mapLocalLegacyFavoritesToContentful = async (getState) => {
  return getLocalLegacyFavorites().map((key) => mapLegacyMeditationIdToContentfulMeditation(key, getState))
}

const getLocalLegacyFavorites = async () => {
  try {
    const legacyReduxStore = await AsyncStorage.getItem('root')
    if (!legacyReduxStore) return []

    const parsedState = JSON.parse(legacyReduxStore)
    const favouriteSessions = parsedState?.favouriteSessions

    return favouriteSessions?.keys || []
  } catch (error) {
    console.error('Failed to load legacy favourite sessions:', error)
    return []
  }
}

const mapLegacyMeditationIdToContentfulMeditation = (legacyIdOrContentfulId, getState) => {
  const legacyMeditation = legacyMeditations[legacyIdOrContentfulId]
  const legacyMeditationSequenceLength = legacyMeditation?.audioOnlySequence?.length || legacyMeditation?.sequence?.length
  const meditation = selectLibraryItemByCallback((item) => {
    if (item.contentfulId === legacyIdOrContentfulId) {
      return true
    }

    if (!legacyMeditation) {
      return false
    }

    // If a piece of content has the same title and sequence length as a legacy meditation, return it
    return item.title === legacyMeditation.title && legacyMeditationSequenceLength === item.sequence?.length
  })(getState())
  return meditation
}

export default favoriteMeditationsSlice.reducer




