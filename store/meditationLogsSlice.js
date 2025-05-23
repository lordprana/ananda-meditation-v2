import { createSlice } from '@reduxjs/toolkit'


export const selectLogByTimestamp = (timestamp) => (state) => state.meditationLogs.find((log) => {
  return Math.floor(log.timestamp) === Math.floor(timestamp)
})
export const selectLogs = (state) => state.meditationLogs

export const disabledMeditationLogsDedupeFunction = (a) => (b) => a.timestamp === b.timestamp
const meditationLogsSlice = createSlice({
  name: 'meditationLogsSlice',
  initialState: [
    /*
      {
        manuallyAdded: bool,
        duration: int // seconds,
        timestamp: int // unix timestamp
      }
     */
  ], // array of logs
  reducers: {
    setLogs: (state, action) => {
      const meditationLogs = action.payload
      state = meditationLogs
      return state
    },
    updateLog: (state, action) => {
      const newLog = action.payload
      const existingLogIndex = state.findIndex(log => Math.floor(log.timestamp) === Math.floor(newLog.timestamp))
      if (existingLogIndex === -1) {
        state.push({
          isManualLog: true,
          ...newLog,
          timestamp: Math.floor(newLog.timestamp),
        })
      } else {
        state[existingLogIndex] = newLog
      }
    },
  },
})
export const { setLogs, updateLog } = meditationLogsSlice.actions

export default meditationLogsSlice.reducer




