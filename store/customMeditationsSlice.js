// /store/favoriteMeditationsSlice.js
import { createSlice } from '@reduxjs/toolkit'
// import { store } from '@/store/store'
import { dedupeWithComparator } from '@/util'

export const selectCustomMeditationById = (id) => (state) => (state.customMeditations.find((item) => item.contentfulId === id))

export const customMeditationsDedupeFunction = (a) => (b) => b.contentfulId && a.contentfulId && b.contentfulId  === a.contentfulId
const customMeditationsSlice = createSlice({
  name: 'customMeditations',
  initialState: [], // array of meditation IDs
  reducers: {
    setCustomMeditations: (state, action) => {
      const dedupedCustomMeditations = dedupeWithComparator(action.payload, customMeditationsDedupeFunction)
      return dedupedCustomMeditations
    },
    addCustomMeditation: (state, action) => {
      const newMeditation = {
        contentfulId: `custom-${Date.now()}`,
        contentfulContentType: 'meditation',
        ...action.payload,
      }
      const dedupedCustomMeditations = dedupeWithComparator([...state, newMeditation], customMeditationsDedupeFunction)
      return dedupedCustomMeditations
    }
  },
})
export const { setCustomMeditations, addCustomMeditation } = customMeditationsSlice.actions

export default customMeditationsSlice.reducer




