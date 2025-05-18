import { combineReducers, configureStore, createAction } from '@reduxjs/toolkit'
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from 'redux-persist'
import AsyncStorage from '@react-native-async-storage/async-storage'

// Import your slices
import favoriteMeditationsReducer, { favoritesDedupeFunction } from './favoriteMeditationsSlice'
import disabledVideoMeditationsReducer, { disabledVideoDedupeFunction } from '@/store/disabledVideoMeditationsSlice'
import offlineMeditationStatusesReducer from '@/store/offlineMeditationStatusesSlice'
import meditationLibrariesReducer, { loadMeditationLibraries } from '@/store/meditationLibrariesSlice'
import userReducer, { logUserIntoFirebase } from './userSlice'
import customMeditationsReducer, { customMeditationsDedupeFunction } from '@/store/customMeditationsSlice'
import { getDatabaseValue, setDatabaseValue } from '@/logic/database'
import { dedupeWithComparator } from '@/util'
import { loadedLegacyDataFromStorageKey, loadLegacyData } from '@/store/legacy/legacy'

// Create root reducer
const appReducer = combineReducers({
  favoriteMeditations: favoriteMeditationsReducer,
  disabledVideoMeditations: disabledVideoMeditationsReducer,
  offlineMeditationStatuses: offlineMeditationStatusesReducer,
  meditationLibraries: meditationLibrariesReducer,
  customMeditations: customMeditationsReducer,
  user: userReducer,
})

// Wrap the combined reducer to handle REPLACE_STATE
export const replaceState = createAction('REPLACE_STATE')
export const rootReducer = (state, action) => {
  if (action.type === replaceState.type) {
    return action.payload
  }

  return appReducer(state, action)
}

export const rehydrate = () => async (dispatch) => {
  const state = JSON.parse(await AsyncAndFirebaseStorage.getItem(reduxPersistKey))
  dispatch(replaceState(state))
}

const AsyncAndFirebaseStorage = {
  getItem: async (key) => {
    const storage = JSON.parse(await AsyncStorage.getItem(key))
    // If nothing is in storage, it means the user logged out
    // or this is first run, so we dont want to go to firebase
    console.log('rehydrate false')
    console.log(storage, 'storage')
    if (!storage) {
      return null
    }
    const database = JSON.parse(await getDatabaseValue(''))
    console.log(database, 'database')
    // redux-persist stringifies the state and each individual key,
    // so unfortunately the merge logic is very cluttered with parsing
    // and stringifying
    const rehydratedState = JSON.stringify({
      favoriteMeditations: JSON.stringify(dedupeWithComparator([
          ...JSON.parse(storage.favoriteMeditations),
        ...JSON.parse(database?.favoriteMeditations || '[]')], favoritesDedupeFunction)),
      disabledVideoMeditations: JSON.stringify(dedupeWithComparator([
        ...JSON.parse(storage.disabledVideoMeditations),
        ...JSON.parse(database?.disabledVideoMeditations || '[]')], disabledVideoDedupeFunction)),
      customMeditations: JSON.stringify(dedupeWithComparator([
        ...JSON.parse(storage.customMeditations),
        ...JSON.parse(database?.customMeditations || '[]')
      ], customMeditationsDedupeFunction)),
      offlineMeditationStatuses: storage.offlineMeditationStatuses, // Do not sync this from firebase, because it is not stored there
      user: storage.user || database?.user,
    })
    console.log(rehydratedState, 'rehydratedState')
    return rehydratedState
  },
  setItem: async (key, data) => {
    console.log('setting item')
    await AsyncStorage.setItem(key, data)
    await setDatabaseValue('', data)
  },
  removeItem: async (key) => {
    await AsyncStorage.removeItem(key)
    await setDatabaseValue('', null)
  },
}

// Persist configuration
const reduxPersistKey = 'root'
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
