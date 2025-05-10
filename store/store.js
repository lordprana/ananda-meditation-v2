// /store/store.js
import { configureStore } from '@reduxjs/toolkit';
import favoriteMeditationsReducer, { loadFavoritesFromStorage } from './favoriteMeditationsSlice'
import disabledVideoMeditationsReducer, { loadDisabledVideoMeditationsFromStorage } from '@/store/disabledVideoMeditationsSlice'
import offlineMeditationStatusesReducer, { loadOfflineMeditationStatusesFromStorage } from '@/store/offlineMeditationStatusesSlice'
import meditationLibrariesReducer, { loadMeditationLibraries } from '@/store/meditationLibrariesSlice'

export const store = configureStore({
  reducer: {
    favoriteMeditations: favoriteMeditationsReducer,
    disabledVideoMeditations: disabledVideoMeditationsReducer,
    offlineMeditationStatuses: offlineMeditationStatusesReducer,
    meditationLibraries: meditationLibrariesReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // needed for AsyncStorage
    }),
});

// Centralized loader for all persisted slices
export const loadData = () => async (dispatch) => {
  await Promise.all([
    dispatch(loadFavoritesFromStorage()),
    dispatch(loadDisabledVideoMeditationsFromStorage()),
    dispatch(loadOfflineMeditationStatusesFromStorage()),
    dispatch(loadMeditationLibraries())
  ]);
};
