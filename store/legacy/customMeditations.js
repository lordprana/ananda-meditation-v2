import AsyncStorage from '@react-native-async-storage/async-storage'
import { loadLegacyStorage } from './favorites'
import legacySegments from './data/legacySegments'
import { selectLibraryItemByCallback } from '../meditationLibrariesSlice'



const getLocalLegacyCustomMeditations = async () => {
  const legacyReduxStore = await loadLegacyStorage()
  const legacyCustomMeditations = legacyReduxStore?.customDataReducer?.customSessions
  return legacyCustomMeditations
}

export const mapLocalLegacyMeditationsToContentful = async (getState) => {
  const legacyCustomMeditations = await getLocalLegacyCustomMeditations()
  if (!legacyCustomMeditations) return []

  return mapLegacyMeditationsToContentful(legacyCustomMeditations, getState)
}

export const mapLegacyMeditationsToContentful = async (meditations, getState) => {
  const customMeditations = Object.keys(meditations).map((key) => {
    const customMeditation = meditations[key]
    return {
      title: customMeditation.title,
      thumbnailUrl: '', // TODO: figure out image handling
      segments: customMeditation.segments.map((segmentId) => mapLegacySeqmentIdToContentfulSegment(segmentId, getState))
    }
  })
  return customMeditations
}

export const mapLegacySeqmentIdToContentfulSegment = (legacyId, getState) => {
  const legacySegment = legacySegments[legacyId]

  // If a piece of content has the same audio url as the legacy segment url, return it
  const segment = selectLibraryItemByCallback((item) => {
    return legacySegment && item.audioUrl === legacySegment.url
  })(getState())

  return segment
}
