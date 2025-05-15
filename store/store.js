// /store/store.js
import { configureStore } from '@reduxjs/toolkit'
import favoriteMeditationsReducer, { loadFavorites, loadFavoritesFromDatabase } from './favoriteMeditationsSlice'
import disabledVideoMeditationsReducer, {
  loadDisabledVideoMeditationsFromStorage,
} from '@/store/disabledVideoMeditationsSlice'
import offlineMeditationStatusesReducer, {
  loadOfflineMeditationStatusesFromStorage,
} from '@/store/offlineMeditationStatusesSlice'
import meditationLibrariesReducer, { loadMeditationLibraries } from '@/store/meditationLibrariesSlice'
import userReducer, { loadUserFromStorage } from './userSlice'

export const store = configureStore({
  reducer: {
    favoriteMeditations: favoriteMeditationsReducer,
    disabledVideoMeditations: disabledVideoMeditationsReducer,
    offlineMeditationStatuses: offlineMeditationStatusesReducer,
    meditationLibraries: meditationLibrariesReducer,
    user: userReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // needed for AsyncStorage
    }),
})

// Centralized loader for all persisted slices
export const loadData = () => async (dispatch) => {
  await Promise.all([
    dispatch(loadFavorites()),
    dispatch(loadDisabledVideoMeditationsFromStorage()),
    dispatch(loadOfflineMeditationStatusesFromStorage()),
    dispatch(loadMeditationLibraries()),
    dispatch(loadUserFromStorage()),
  ])
}
