// /store/favoriteMeditationsSlice.js
import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'favoriteMeditations';

export const selectIsFavoriteMeditation = (id) => (state) => state.favoriteMeditations.includes(id);

const favoriteMeditationsSlice = createSlice({
  name: 'favoriteMeditations',
  initialState: [], // array of meditation IDs
  reducers: {
    toggleFavorite: (state, action) => {
      const id = action.payload;
      const index = state.indexOf(id);
      if (index === -1) {
        state.push(id);
      } else {
        state.splice(index, 1);
      }
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    },
    setFavorites: (state, action) => {
      return action.payload;
    },
  },
});
const { toggleFavorite, setFavorites } = favoriteMeditationsSlice.actions;

export const toggleFavoriteAsync = (id) => async (dispatch, getState) => {
  dispatch(toggleFavorite(id));
  try {
    const updated = getState().favoriteMeditations;
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    // await api.post('/user/favorites', { favorites: updated }); // Optional server sync
  } catch (e) {
    console.warn('Failed to persist favorite changes', e);
    // Optionally dispatch rollback or error notification here
  }
};

export const loadFavoritesFromStorage = () => async (dispatch) => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    if (data) {
      dispatch(setFavorites(JSON.parse(data)));
    }
  } catch (e) {
    console.warn('Failed to load favorites from storage', e);
  }
};

export default favoriteMeditationsSlice.reducer;




