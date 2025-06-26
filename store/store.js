import { combineReducers, configureStore, createAction } from '@reduxjs/toolkit'
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'

import { AsyncAndFirebaseStorage, reduxPersistKey } from './storage/AsyncAndFirebaseStorage'
import favoriteMeditationsReducer from './favoriteMeditationsSlice'
import disabledVideoMeditationsReducer from '@/store/disabledVideoMeditationsSlice'
import offlineMeditationStatusesReducer from '@/store/offlineMeditationStatusesSlice'
import meditationLibrariesReducer, { loadMeditationLibraries } from '@/store/meditationLibrariesSlice'
import userReducer, { logUserIntoFirebase } from './userSlice'
import customMeditationsReducer from '@/store/customMeditationsSlice'
import { loadedLegacyDataFromStorageKey, loadLegacyData } from '@/store/legacy/legacy'
import AsyncStorage from '@react-native-async-storage/async-storage'
import meditationLogsReducer from '@/store/meditationLogsSlice'

// Root Reducer and State Replacement
const appReducer = combineReducers({
  favoriteMeditations: favoriteMeditationsReducer,
  disabledVideoMeditations: disabledVideoMeditationsReducer,
  offlineMeditationStatuses: offlineMeditationStatusesReducer,
  meditationLibraries: meditationLibrariesReducer,
  customMeditations: customMeditationsReducer,
  meditationLogs: meditationLogsReducer,
  user: userReducer,
})

export const replaceState = createAction('REPLACE_STATE')

const rootReducer = (state, action) =>
  action.type === replaceState.type ? action.payload : appReducer(state, action)

// Rehydration Utility
export const rehydrate = () => async (dispatch, getState) => {

  const state = JSON.parse(await AsyncAndFirebaseStorage.getItem(reduxPersistKey))

  if (state) dispatch(replaceState(state))
}

// Persist Config
const persistConfig = {
  key: reduxPersistKey,
  storage: AsyncAndFirebaseStorage,
  timeout: 30 * 1000, // 30 seconds
  blacklist: [
    'meditationLibraries',
  ],
}

// Store Configuration
export const store = configureStore({
  reducer: persistReducer(persistConfig, rootReducer),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: { ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER] },
    }),
})

export const persistor = persistStore(store)

// Centralized Initial Loader
export const loadData = () => async (dispatch, getState) => {
  const user = getState().user
  try {
    await logUserIntoFirebase(user)
  } catch (e) {
    console.log('Error logging user into Firebase:', e)
  }
  await dispatch(loadMeditationLibraries())

  const loadedLegacyData = await AsyncStorage.getItem(loadedLegacyDataFromStorageKey)
  if (!loadedLegacyData) {
    try {
      await dispatch(loadLegacyData())
    } catch (e) {
      console.error('Error loading legacy data:', e)
    }
  }
}
