import axios from 'axios'
import Constants from 'expo-constants'
import { makeRedirectUri, revokeAsync } from 'expo-auth-session'
import { Linking, Platform } from 'react-native'
import { setIsLoggedIn } from '@/store/userSlice'
import { rehydrate } from '@/store/store'
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

export const logoutOfAuth0 = async (accessToken) => {
  await revokeAsync({
    token: accessToken,
    clientId,
    revocationEndpoint: `https://${auth0Domain}/oauth/revoke`,
  })
  const logoutUrl = `https://${auth0Domain}/logout?clientId=${clientId}&returnTo=${getRedirectUri()}`
  await Linking.openURL(logoutUrl)

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

  const firebaseToken = await getFirebaseLoginToken(idToken)
  dispatch(setIsLoggedIn({
    emailAddress: userInfo.email,
    firebaseToken,
    accessToken,
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
    await dispatch(loadLegacyData)
  }
  await dispatch(rehydrate)
}
