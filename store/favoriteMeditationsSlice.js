// /store/favoriteMeditationsSlice.js
import { createSlice } from '@reduxjs/toolkit'
// import { store } from '@/store/store'
import { dedupeWithComparator } from '@/util'

export const selectIsFavoriteMeditation = (id) => (state) => state.favoriteMeditations.includes(id)
export const selectFavoriteMeditationIds = (state => state.favoriteMeditations)

export const favoritesDedupeFunction = (a) => (b) => a === b
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
      const dedupedFavorites = dedupeWithComparator(action.payload, favoritesDedupeFunction)
      return dedupedFavorites
    },
  },
})
export const { toggleFavorite, setFavorites } = favoriteMeditationsSlice.actions

export default favoriteMeditationsSlice.reducer




