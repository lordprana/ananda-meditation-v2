// /store/store.js
import { configureStore } from '@reduxjs/toolkit';
import favoriteMeditationsReducer, { loadFavoritesFromStorage } from './favoriteMeditationsSlice'

export const store = configureStore({
  reducer: {
    favoriteMeditations: favoriteMeditationsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // needed for AsyncStorage
    }),
});

// Centralized loader for all persisted slices
export const loadDataFromLocalStorage = () => async (dispatch) => {
  await Promise.all([
    dispatch(loadFavoritesFromStorage()),
  ]);
};
