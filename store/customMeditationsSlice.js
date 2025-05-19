// /store/favoriteMeditationsSlice.js
import { createSlice } from '@reduxjs/toolkit'
// import { store } from '@/store/store'
import { dedupeWithComparator } from '@/util'

export const selectCustomMeditationById = (id) => (state) => (state.customMeditations.find((item) => item.contentfulId === id))

export const customMeditationsDedupeFunction = (a) => (b) => b.contentfulId && a.contentfulId && b.contentfulId === a.contentfulId
export const getNewCustomMeditationId = () => `custom-${Date.now()}`
const customMeditationsSlice = createSlice({
  name: 'customMeditations',
  initialState: [], // array of meditation IDs
  reducers: {
    setCustomMeditations: (state, action) => {
      const dedupedCustomMeditations = dedupeWithComparator(action.payload, customMeditationsDedupeFunction)
      return dedupedCustomMeditations
    },
    addCustomMeditationById: (state, action) => {
      const newMeditation = {
        contentfulId: action.payload,
        contentfulContentType: 'meditation',
      }
      return [...state, newMeditation]
    },
    updateCustomMeditationTitle: (state, { payload: { id, title } }) => {
      const meditation = state.find((item) => item.contentfulId === id)
      if (meditation) {
        meditation.title = title
      }
    },
    addCustomMeditationSegment: (state, { payload: { id, segment } }) => {
      const meditation = state.find((item) => item.contentfulId === id)
      if (meditation) {
        meditation.segments = [...meditation.segments, segment]
      }
    },
    updateCustomMeditationThumbailUrl: (state, { payload: { id, thumbnailUrl } }) => {
      const meditation = state.find((item) => item.contentfulId === id)
      if (meditation) {
        meditation.thumbnailUrl = thumbnailUrl
      }
    },
    removeCustomMeditationById: (state, { payload }) => {
      const meditationIndex = state.findIndex((item) => item.contentfulId === payload)
      if (meditationIndex !== -1) {
        state.splice(meditationIndex, 1)
      }
    }
  },
})
export const { setCustomMeditations, addCustomMeditationSegment, removeCustomMeditationById, addCustomMeditationById, updateCustomMeditationSegments, updateCustomMeditationTitle, updateCustomMeditationThumbailUrl } = customMeditationsSlice.actions

export default customMeditationsSlice.reducer




