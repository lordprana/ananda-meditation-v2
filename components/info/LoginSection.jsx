import Header from '../ui/Header'
import { Platform, View } from 'react-native'
import Button from '../ui/Button'
import * as AuthSession from 'expo-auth-session'
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session'
import { useEffect, useState } from 'react'
import { auth0Domain, clientId, discovery, getRedirectUri, onAuth0SuccessfulLogin } from '../../logic/authentication'
import Constants from 'expo-constants'


const LoginSection = () => {
  const [loadingUser, setLoadingUser] = useState(false)
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId,
      redirectUri: getRedirectUri(),
      scopes: ['openid', 'profile', 'email', 'user_metadata'],
      responseType: 'token id_token',
      extraParams: {
        nonce: 'some-random-string'
      }
    },
    discovery,
  )


  useEffect(() => {
    (async () => {
      if (response?.type === 'success') {
        await onAuth0SuccessfulLogin(response)
      }
    })()
  }, [response])

  return (
    <View>
      <Header>
        User Account
      </Header>
      <Button label={'Log In or Sign Up'} onPress={() =>  promptAsync() } />
    </View>
  )
}

export default LoginSection
