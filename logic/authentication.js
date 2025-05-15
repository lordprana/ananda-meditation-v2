import axios from 'axios'
import auth from '@react-native-firebase/auth'
import Constants from 'expo-constants'

export const auth0Domain = 'anandasangha.auth0.com'
export const clientId = 'EDJm2T0Ntt6wNOGq47jCb1gSxOB6BorM'

export const discovery = {
  authorizationEndpoint: `https://${auth0Domain}/authorize`,
  tokenEndpoint: `https://${auth0Domain}/oauth/token`,
  revocationEndpoint: `https://${auth0Domain}/v2/logout`,
}

export const onAuth0SuccessfulLogin = async (response) => {
  console.log('calling function')
  console.log(response)
  const { accessToken, idToken } = response.authentication

  // Call /userinfo to get the user's email and profile
  console.log('request user info')
  const userInfoResponse = await axios.get(`https://${auth0Domain}/userinfo`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  await signinOnFirebase(idToken)

}

const signinOnFirebase = async (idToken) => {
  const firebaseToken = await getFirebaseLoginToken(idToken)
  await auth().signInWithCustomToken(firebaseToken)
}

const getFirebaseLoginToken = async (idToken) => {
  const response =  await axios.get(Constants.expoConfig.extra.FIREBASE_CLOUD_AUTH_FUNCTION_PATH, {
    headers: {
      'Authorization': `Bearer ${idToken}`,
    },
  })
  return response.data.firebaseToken
}
