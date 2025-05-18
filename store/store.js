import { combineReducers, configureStore } from '@reduxjs/toolkit'
import {
  createTransform,
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist'
import AsyncStorage from '@react-native-async-storage/async-storage'

// Import your slices
import favoriteMeditationsReducer, { favoritesDedupeFunction } from './favoriteMeditationsSlice'
import disabledVideoMeditationsReducer, { disabledVideoDedupeFunction } from '@/store/disabledVideoMeditationsSlice'
import offlineMeditationStatusesReducer from '@/store/offlineMeditationStatusesSlice'
import meditationLibrariesReducer, { loadMeditationLibraries } from '@/store/meditationLibrariesSlice'
import userReducer, { loadUserFromStorage, logUserIntoFirebase } from './userSlice'
import customMeditationsReducer, { customMeditationsDedupeFunction } from '@/store/customMeditationsSlice'
import { loadCustomMeditations } from '@/store/meditationLibrary/customMeditations'
import { getDatabaseValue, setDatabaseValue } from '@/logic/database'
import { dedupeWithComparator } from '@/util'
import { loadedLegacyDataFromStorageKey, loadLegacyData } from '@/store/legacy/legacy'

// Create root reducer
const rootReducer = combineReducers({
  favoriteMeditations: favoriteMeditationsReducer,
  disabledVideoMeditations: disabledVideoMeditationsReducer,
  offlineMeditationStatuses: offlineMeditationStatusesReducer,
  meditationLibraries: meditationLibrariesReducer,
  customMeditations: customMeditationsReducer,
  user: userReducer,
})

const AsyncAndFirebaseStorage = {
  getItem: async (key) => {
    const storage = JSON.parse(await AsyncStorage.getItem(key))
    const database = JSON.parse(await getDatabaseValue(''))
    const rehydratedState = JSON.stringify({
      favoriteMeditations: dedupeWithComparator([...storage.favoriteMeditations, ...database?.favoriteMeditations || []], favoritesDedupeFunction),
      disabledVideoMeditations: dedupeWithComparator([...storage.disabledVideoMeditations, ...database?.disabledVideoMeditations || []], disabledVideoDedupeFunction),
      offlineMeditationStatuses: storage.offlineMeditationStatuses, // Do not sync this from firebase, because it is not stored there
      customMeditations: dedupeWithComparator([...storage.customMeditations, ...database?.customMeditations || []], customMeditationsDedupeFunction),

      user: storage.user || database?.user,
    })
    return rehydratedState
  },
  setItem: async (key, data) => {
    await AsyncStorage.setItem(key, data)
    await setDatabaseValue('', data)
  },
  removeItem: async (key) => {
    await AsyncStorage.removeItem(key)
    await setDatabaseValue('', null)
  },
}

// Persist configuration
const persistConfig = {
  key: 'root',
  storage: AsyncAndFirebaseStorage,
  whitelist: [
    'favoriteMeditations',
    'disabledVideoMeditations',
    'offlineMeditationStatuses',
    'customMeditations',
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
export const persistor = persistStore(store)// Centralized loader for all persisted slices

export const loadData = () => async (dispatch, getState) => {
  // Load user data first and log into
  // Firebase auth
  const user = getState().user
  await logUserIntoFirebase(user)

  await dispatch(loadMeditationLibraries())

  const loadedLegacyData = await AsyncStorage.getItem(loadedLegacyDataFromStorageKey)
  if (!loadedLegacyData) {
    await dispatch(loadLegacyData())
  }
}
