import { createSlice } from '@reduxjs/toolkit'

export const selectIsDisabledVideoMeditation = (id) => (state) => state.disabledVideoMeditations.includes(id);

export const disabledVideoDedupeFunction = (a) => (b) => a === b;
const disabledVideoMeditationsSlice = createSlice({
  name: 'disabledVideoMeditations',
  initialState: [], // array of meditation IDs
  reducers: {
    toggleDisabledVideo: (state, action) => {
      const id = action.payload;
      const index = state.indexOf(id);
      if (index === -1) {
        state.push(id);
      } else {
        state.splice(index, 1);
      }
    },
  },
});
export const { toggleDisabledVideo } = disabledVideoMeditationsSlice.actions;

export default disabledVideoMeditationsSlice.reducer;




