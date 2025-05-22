import { createSlice } from '@reduxjs/toolkit'


export const selectIsDisabledVideoMeditation = (id) => (state) => state.disabledVideoMeditations.includes(id);

export const disabledMeditationLogsDedupeFunction = (a) => (b) => a.timestamp === b.timestamp;
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
    setLogs : (state, action) => {
      const meditationLogs = action.payload;
      state = meditationLogs
      return state
    },
    addLog: (state, action) => {
      const newLog = action.payload;
      const existingLogIndex = state.findIndex(log => log.timestamp === newLog.timestamp);
      if (existingLogIndex === -1) {
        state.push(newLog);
      }
    },
  },
});
export const { setLogs, addLog } = meditationLogsSlice.actions;




