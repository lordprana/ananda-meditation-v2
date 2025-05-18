import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from 'redux-persist'
import AsyncStorage from '@react-native-async-storage/async-storage'

// Import your slices
import favoriteMeditationsReducer, { favoritesDedupeFunction } from './favoriteMeditationsSlice'
import disabledVideoMeditationsReducer, {
  disabledVideoDedupeFunction,
  loadDisabledVideoMeditationsFromStorage,
} from '@/store/disabledVideoMeditationsSlice'
import offlineMeditationStatusesReducer from '@/store/offlineMeditationStatusesSlice'
import meditationLibrariesReducer, { loadMeditationLibraries } from '@/store/meditationLibrariesSlice'
import userReducer, { loadUserFromStorage, logUserIntoFirebase } from './userSlice'
import { loadCustomMeditations } from '@/store/meditationLibrary/customMeditations'
import { getDatabaseValue, setDatabaseValue } from '@/logic/database'
import { dedupeWithComparator } from '@/util'

// Create root reducer
const rootReducer = combineReducers({
  favoriteMeditations: favoriteMeditationsReducer,
  disabledVideoMeditations: disabledVideoMeditationsReducer,
  offlineMeditationStatuses: offlineMeditationStatusesReducer,
  meditationLibraries: meditationLibrariesReducer,
  user: userReducer
})

const AsyncAndFirebaseStorage = {
  getItem: async (key) => {
    const storage = JSON.parse(await AsyncStorage.getItem(key))
    const database = await getDatabaseValue('')
    return JSON.stringify({
      favoriteMeditations: dedupeWithComparator([...storage.favoriteMeditations, ...database?.favoriteMeditations || []], favoritesDedupeFunction),
      disabledVideoMeditations: dedupeWithComparator([...storage.disabledVideoMeditations, ...database?.disabledVideoMeditations || []], disabledVideoDedupeFunction),
      offlineMeditationStatuses: storage.offlineMeditationStatuses, // Do not sync this from firebase, because it is not stored there
      user: storage.user || database?.user,
    })
  },
  setItem: async (key, data) => {
    await AsyncStorage.setItem(key, data)
    const firebaseData = { ...data }
    delete firebaseData.offlineMeditationStatuses

    await setDatabaseValue('', data)
  },
  removeItem: async (key) => {
    await AsyncStorage.removeItem(key)
    await setDatabaseValue('', null)
  }
}

// Persist configuration
const persistConfig = {
  key: 'root',
  storage: AsyncAndFirebaseStorage,
  whitelist: [
    'favoriteMeditations',
    'disabledVideoMeditations',
    'offlineMeditationStatuses',
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
  await dispatch(loadUserFromStorage())
  const user = getState().user
  await logUserIntoFirebase(user)

  await Promise.all([
    dispatch(loadMeditationLibraries()),
    dispatch(loadCustomMeditations()),
    dispatch(loadDisabledVideoMeditationsFromStorage()),
  ])
}
