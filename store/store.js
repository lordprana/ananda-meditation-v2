import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import AsyncStorage from '@react-native-async-storage/async-storage'

// Import your slices
import favoriteMeditationsReducer, { loadFavorites, loadFavoritesFromDatabase } from './favoriteMeditationsSlice'
import disabledVideoMeditationsReducer, { loadDisabledVideoMeditationsFromStorage } from '@/store/disabledVideoMeditationsSlice'
import offlineMeditationStatusesReducer, { loadOfflineMeditationStatusesFromStorage } from '@/store/offlineMeditationStatusesSlice'
import meditationLibrariesReducer, { loadMeditationLibraries } from '@/store/meditationLibrariesSlice'
import userReducer, { loadUserFromStorage, logUserIntoFirebase } from './userSlice'
import { loadCustomMeditations } from '@/store/meditationLibrary/customMeditations'

// Create root reducer
const rootReducer = combineReducers({
  favoriteMeditations: favoriteMeditationsReducer,
  disabledVideoMeditations: disabledVideoMeditationsReducer,
  offlineMeditationStatuses: offlineMeditationStatusesReducer,
  meditationLibraries: meditationLibrariesReducer,
  user: userReducer
})

const LEGACY_REDUX_PERSIST_KEY = 'root'
// Firebase and AsyncStorage integration
const FirebaseAndAsyncStorage = {
  getItem: async (key) => {
    // Hydrate local legacy data

    // Hydrate data from Firebase
    
    // Hydrate data from local storage
    const value = await AsyncStorage.getItem(key)
    return value
  },
  setItem: async (key, value) => {

  },
  removeItem: async (key) => {
    await AsyncStorage.removeItem(key)
  }
}

// Persist configuration
const persistConfig = {
  key: 'updatedAppRoot',
  storage: AsyncStorage,
  whitelist: [
    'favoriteMeditations',
    'disabledVideoMeditations',
    'offlineMeditationStatuses',
    'meditationLibraries',
    'user',
  ],
}

// Wrap root reducer with persist reducer
const persistedReducer = persistReducer(persistConfig, rootReducer)

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

// Create persistor
export const persistor = persistStore(store)

// Centralized loader for all persisted slices
export const loadData = () => async (dispatch, getState) => {
  // Load user data and sync with Firebase
  await dispatch(loadUserFromStorage())
  const user = getState().user
  await logUserIntoFirebase(user)

  // Load other slice data
  await Promise.all([
    dispatch(loadMeditationLibraries()),
    dispatch(loadFavorites()),
    dispatch(loadCustomMeditations()),
    dispatch(loadDisabledVideoMeditationsFromStorage()),
    dispatch(loadOfflineMeditationStatusesFromStorage()),
  ])
}
