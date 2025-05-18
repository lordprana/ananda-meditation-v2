import axios from 'axios'
import auth from '@react-native-firebase/auth'
import Constants from 'expo-constants'
import { makeRedirectUri } from 'expo-auth-session'
import { Platform } from 'react-native'
import { logUserIntoFirebase, setIsLoggedInAsync } from '@/store/userSlice'
import { loadData, rehydrate } from '@/store/store'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { loadedLegacyDataFromDatabaseKey, loadLegacyData } from '@/store/legacy/legacy'

export const auth0Domain = 'anandasangha.auth0.com'
export const clientId = 'EDJm2T0Ntt6wNOGq47jCb1gSxOB6BorM'

export const getRedirectUri = () => {
  const packageOrBundleId = Platform.select({
    ios: Constants.expoConfig?.ios?.bundleIdentifier,
    android: Constants.expoConfig?.android?.package
  })
  return makeRedirectUri({
    scheme: packageOrBundleId,
    path: `${auth0Domain}/${Platform.OS}/${packageOrBundleId}/callback`,
    isTripleSlashed: false,
  })
}

export const discovery = {
  authorizationEndpoint: `https://${auth0Domain}/authorize`,
  tokenEndpoint: `https://${auth0Domain}/oauth/token`,
  revocationEndpoint: `https://${auth0Domain}/v2/logout`,
}

export const onAuth0SuccessfulLogin = async (response, dispatch) => {
  const { accessToken, idToken } = response.authentication

  // Call /userinfo to get the user's email and profile
  const userInfoResponse = await axios.get(`https://${auth0Domain}/userinfo`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  const userInfo = userInfoResponse.data
  console.log(userInfo)

  const firebaseToken = await getFirebaseLoginToken(idToken)
  dispatch(setIsLoggedInAsync({
    emailAddress: userInfo.email,
    firebaseToken,
  }))

  // User must be logged in in the redux
  // store for this to pull data from
  // the server
  dispatch(onInitialLogIn())
}


const getFirebaseLoginToken = async (idToken) => {
  const response =  await axios.get(Constants.expoConfig.extra.FIREBASE_CLOUD_AUTH_FUNCTION_PATH, {
    headers: {
      'Authorization': `Bearer ${idToken}`,
    },
  })
  return response.data.firebaseToken
}

const onInitialLogIn = () => async (dispatch, getState) => {
  const loadedLegacyDataFromDatabase = await AsyncStorage.getItem(loadedLegacyDataFromDatabaseKey)
  if (!loadedLegacyDataFromDatabase) {
    dispatch(loadLegacyData)
  }
  dispatch(rehydrate)

}
