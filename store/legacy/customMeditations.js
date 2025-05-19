import AsyncStorage from '@react-native-async-storage/async-storage'
import { loadLegacyStorage } from './favorites'
import legacySegments from './data/legacySegments'
import { selectLibraryItemByCallback } from '../meditationLibrariesSlice'
import { createSilentMeditationSegments } from '@/components/configure-silent-timer/SilentMeditationLogic'
import { DATABASE_PATHS, getDatabaseValue } from '@/logic/database'


export const loadLegacyCustomMeditationsFromStorage = async () => {
  const legacyReduxStore = await loadLegacyStorage()
  const legacyCustomMeditations = legacyReduxStore?.customDataReducer?.customSessions
  return legacyCustomMeditations || {}
}

const getLocalLegacySilentMeditations = async () => {
  const legacyReduxStore = await loadLegacyStorage()
  const legacySilentMeditations = legacyReduxStore?.firebaseReducer?.customSilentTracks
  return legacySilentMeditations
}

let remoteLegacySilentMeditations
let localLegacySilentMeditations

const getLegacySilentMeditationDuration = async (silentMeditationId) => {
  if (!remoteLegacySilentMeditations) {
    remoteLegacySilentMeditations = await getDatabaseValue(DATABASE_PATHS.silentMeditations)
  }
  if (!localLegacySilentMeditations) {
    localLegacySilentMeditations = await getLocalLegacySilentMeditations()

  }

  return remoteLegacySilentMeditations[silentMeditationId]?.duration || localLegacySilentMeditations[silentMeditationId]?.duration
}

export const mapLegacyMeditationsToNewSchema = async (meditations, getState) => {
  const customMeditations = await Promise.all(Object.keys(meditations).map(async (key) => {
    const customMeditation = meditations[key]
    return {
      title: customMeditation.title,
      thumbnailUrl: '', // TODO: figure out image handling
      segments: await Promise.all(customMeditation.segments.map(async (segmentId) => mapLegacySeqmentIdToContentfulSegment(segmentId, getState))),
      contentfulId: key
    }
  }))
  return customMeditations
}

export const mapLegacySeqmentIdToContentfulSegment = async (legacyId, getState) => {
  if (legacyId.startsWith('SILENTTIMER')) {
    const silentDuration = await getLegacySilentMeditationDuration(legacyId)
    return {
      category: 'Silent',
      isIndefinite: false,
      duration: silentDuration,
      segments: createSilentMeditationSegments({
        meditationLength: silentDuration,
      }),
      contentfulContentType: "meditationSegments"
    }
  }

  const legacySegment = legacySegments[legacyId]

  // If a piece of content has the same audio url as the legacy segment url, return it
  const segment = selectLibraryItemByCallback((item) => {
    return legacySegment && item.audioUrl === legacySegment.url
  })(getState())

  return segment
}
