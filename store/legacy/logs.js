import { loadLegacyStorage } from './favorites'
import { selectCustomMeditationById } from '../customMeditationsSlice'
import legacyMeditations from './data/legacyMeditations'

export const loadLegacyLogsFromStorage = async () => {
  const legacyReduxStore = await loadLegacyStorage()
  const legacyCustomMeditations = legacyReduxStore?.customDataReducer?.logEntries
  return legacyCustomMeditations || {}
}

export const mapLegacyLogsToNewSchema = (legacyLogs, getState) => {
  return legacyLogs.map((legacyLog) => {
    const customMeditation = selectCustomMeditationById(legacyLog.sessionId)(getState())
    const legacyMeditation = legacyMeditations[legacyLog.sessionId]
    return {
      isManualLog: legacyLogs.manuallyAdded,
      duration: legacyLogs.duration,
      timestamp: legacyLogs.timestamp,
      title: legacyMeditation.title || customMeditation.title,
    }
  })
}
