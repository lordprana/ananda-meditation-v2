import { createSlice } from '@reduxjs/toolkit'
import AsyncStorage from '@react-native-async-storage/async-storage'
import auth from '@react-native-firebase/auth'
import { logoutOfAuth0 } from '@/logic/authentication'

const USER_IS_LOGGED_IN = 'USER_IS_LOGGED_IN'

export const selectUser = (state) => state.user
export const selectIsKriyaban = (state) => state.user.isKriyaban
export const selectIsLoggedIn = (state) => state.user.isLoggedIn

const userSlice = createSlice({
  name: 'user',
  initialState: {
    isKriyaban: false,
    isLoggedIn: false,
    emailAddress: null,
    firebaseToken: null,
  },
  reducers: {
    setIsKriyaban: (state, action) => {
      state.isKriyaban = action.payload
    },
    setIsLoggedIn: (state, action) => {
      state.isLoggedIn = true
      state = { ...state, ...action.payload }
    },
    setIsLoggedOut: (state, action) => {
      state.isLoggedIn = false
      state.emailAddress = ''
      state.firebaseToken = ''
    },
    setUser: (state, action) => {
      return action.payload
    },
  },
})

export const { setIsKriyaban, setIsLoggedIn, setUser } = userSlice.actions
const { setIsLoggedOut } = userSlice.actions

export const logUserIntoFirebase = async (user) => {
  if (user && user.firebaseToken) {
    await auth().signInWithCustomToken(user.firebaseToken)
  }
}

export const logUserOutOfFirebase = () => async (dispatch, getState) => {
  dispatch(setIsLoggedOut())
  await auth().signOut()
  await logoutOfAuth0(getState().user.firebaseToken)
}

export default userSlice.reducer
