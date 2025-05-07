// /store/favoriteMeditationsSlice.js
import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'disabledVideoMeditations';

export const selectIsDisabledVideoMeditation = (id) => (state) => state.disabledVideoMeditations.includes(id);

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
    setDisabledVideos: (state, action) => {
      return action.payload;
    },
  },
});
const { toggleDisabledVideo, setDisabledVideos } = disabledVideoMeditationsSlice.actions;

export const toggleDisabledVideoAsync = (id) => async (dispatch, getState) => {
  dispatch(toggleDisabledVideo(id));
  try {
    const updated = getState().disabledVideoMeditations;
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    // await api.post('/user/favorites', { favorites: updated }); // Optional server sync
  } catch (e) {
    console.warn('Failed to persist disabledVideo changes', e);
    // Optionally dispatch rollback or error notification here
  }
};

export const loadDisabledVideoMeditationsFromStorage = () => async (dispatch) => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    if (data) {
      dispatch(setDisabledVideos(JSON.parse(data)));
    }
  } catch (e) {
    console.warn('Failed to load favorites from storage', e);
  }
};

export default disabledVideoMeditationsSlice.reducer;




