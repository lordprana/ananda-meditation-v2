// /store/favoriteMeditationsSlice.js
import { createSlice } from '@reduxjs/toolkit'
// import { store } from '@/store/store'
import { dedupeWithComparator } from '@/util'

export const selectCustomMeditationById = (id) => (state) => (state.customMeditations.find((item) => item.contentfulId === id))
export const selectCustomMeditations = (state) => state.customMeditations.filter((customMeditation) => customMeditation.segments.length > 0)

export const customMeditationsDedupeFunction = (a) => (b) => b.contentfulId && a.contentfulId && b.contentfulId === a.contentfulId
const getNewCustomMeditationId = () => `custom-${Date.now()}`
export const getNewCustomMeditation = () => {
  return {
    contentfulId: getNewCustomMeditationId(),
    contentfulContentType: 'meditation',
    segments: [],
    segmentsForEditing: [],
    title: 'Untitled',
    thumbnailUrl: '',
  }
}

const customMeditationsSlice = createSlice({
  name: 'customMeditations',
  initialState: [], // array of meditation IDs
  reducers: {
    setCustomMeditations: (state, action) => {
      const dedupedCustomMeditations = dedupeWithComparator(action.payload, customMeditationsDedupeFunction)
      return dedupedCustomMeditations
    },
    addCustomMeditation: (state, action) => {
      return [...state, action.payload]
    },
    saveMeditationWithNewTitle: (state, { payload: { id, title } }) => {
      const meditation = state.find((item) => item.contentfulId === id)
      if (meditation) {
        meditation.title = title
        meditation.segments = [...meditation.segmentsForEditing]
        meditation.thumbnailUrl = meditation.thumbnailUrlForEditing
      }
    },
    addCustomMeditationSegmentForEditing: (state, { payload: { id, segment } }) => {
      const meditation = state.find((item) => item.contentfulId === id)
      if (meditation) {
        meditation.segmentsForEditing = [...meditation.segmentsForEditing, segment]
      }
    },
    setCustomMeditationSegmentsForEditing: (state, { payload: { id, segments } }) => {
      const meditation = state.find((item) => item.contentfulId === id)
      if (meditation) {
        meditation.segmentsForEditing = segments
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
export const { setCustomMeditations, saveMeditationWithNewTitle, addCustomMeditationSegmentForEditing, removeCustomMeditationById, addCustomMeditation, setCustomMeditationSegmentsForEditing, updateCustomMeditationTitle, updateCustomMeditationThumbailUrl } = customMeditationsSlice.actions

export default customMeditationsSlice.reducer




