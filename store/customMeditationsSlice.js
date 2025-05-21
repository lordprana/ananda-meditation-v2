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
    image: {},
    imageForEditing: {},
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
        meditation.image = meditation.imageForEditing
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
    updateCustomMeditationImageForEditing: (state, { payload: { id, image } }) => {
      const meditation = state.find((item) => item.contentfulId === id)
      if (meditation) {
        meditation.imageForEditing = image
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
export const { setCustomMeditations, updateCustomMeditationImageForEditing, saveMeditationWithNewTitle, addCustomMeditationSegmentForEditing, removeCustomMeditationById, addCustomMeditation, setCustomMeditationSegmentsForEditing, updateCustomMeditationTitle, updateCustomMeditationImage } = customMeditationsSlice.actions

export default customMeditationsSlice.reducer




