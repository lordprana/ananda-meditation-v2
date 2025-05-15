import { createSlice } from '@reduxjs/toolkit'
import AsyncStorage from '@react-native-async-storage/async-storage'

const STORAGE_KEY = 'userStatus'

export const selectUser = (state) => state.user
export const selectIsKriyaban = (state) => state.user.isKriyaban
export const selectIsLoggedIn = (state) => state.user.isLoggedIn

const userSlice = createSlice({
  name: 'user',
  initialState: {
    isKriyaban: false,
    isLoggedIn: false,
  },
  reducers: {
    setIsKriyaban: (state, action) => {
      state.isKriyaban = action.payload
    },
    setIsLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload
    },
    setUser: (state, action) => {
      return action.payload
    },
  },
})

const { setIsKriyaban, setIsLoggedIn, setUser } = userSlice.actions

// Async actions to persist state
export const setIsKriyabanAsync = (value) => async (dispatch, getState) => {
  dispatch(setIsKriyaban(value))
  await persistUser(getState)
}

export const setIsLoggedInAsync = (value) => async (dispatch, getState) => {
  dispatch(setIsLoggedIn(value))
  await persistUser(getState)
}

// Helper to persist the user state
const persistUser = async (getState) => {
  try {
    const userState = getState().user
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(userState))
  } catch (e) {
    console.warn('Failed to persist user state', e)
  }
}

// Load from storage on app start
export const loadUserFromStorage = () => async (dispatch) => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY)
    if (data) {
      dispatch(setUser(JSON.parse(data)))
    }
  } catch (e) {
    console.warn('Failed to load user state from storage', e)
  }
}

export default userSlice.reducer
