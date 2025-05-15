// /store/favoriteMeditationsSlice.js
import { createSlice } from '@reduxjs/toolkit'
import AsyncStorage from '@react-native-async-storage/async-storage'
import auth from '@react-native-firebase/auth'
import database from '@react-native-firebase/database'
import { stripUidSymbols } from '@/util'
// import { store } from '@/store/store'
// import { selectLibraryItemByCallback } from '@/store/meditationLibrariesSlice'
import legacyMeditations from '@/legacy-data/legacyMeditations'

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
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    // await api.post('/user/favorites', { favorites: updated }); // Optional server sync
  } catch (e) {
    console.warn('Failed to persist favorite changes', e)
    // Optionally dispatch rollback or error notification here
  }
}

const dedupe = (arr) => arr.reduce((acc, item) => acc.includes(item) ? acc : [...acc, item], [])
export const loadFavorites = () => async (dispatch) => {
  const storageFavorites = JSON.parse((await AsyncStorage.getItem(STORAGE_KEY)) || '[]')
  // const databaseFavorites = await loadFavoritesFromDatabase()
  // const allFavorites = dedupe([...storageFavorites, ...databaseFavorites])
  const allFavorites = dedupe([...storageFavorites])
  dispatch(setFavorites(allFavorites))
}

export const loadFavoritesFromDatabase = async () => {
  try {
    const user = auth().currentUser
    return database()
      .ref('/users/' + stripUidSymbols(user.uid) + '/favourites')
      .on('value', response => {
        const favoriteMeditations = response.val()
        return favoriteMeditations.keys.map((meditationId) => mapLegacyMeditationIdToContentfulMeditation(meditationId)?.contentfulId)
      })
  } catch (e) {
    console.warn('Failed to load favorites from database', e)
  }
}

const mapLegacyMeditationIdToContentfulMeditation = (legacyIdOrContentfulId) => {
  const legacyMeditation = legacyMeditations[legacyIdOrContentfulId]
  const legacyMeditationSequenceLength = legacyMeditation.audioOnlySequence?.length || legacyMeditation.sequence.length
  const meditation = selectLibraryItemByCallback((item) => {
    if (item.contentfulId === legacyIdOrContentfulId) {
      return true
    }

    // If a piece of content has the same title and sequence length as a legacy meditation, return it
    return item.title === legacyMeditation.title && legacyMeditationSequenceLength === item.sequence?.length
  })(store.getState())
  return meditation
}

export default favoriteMeditationsSlice.reducer




