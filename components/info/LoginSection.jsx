import Header from '../ui/Header'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import Button from '../ui/Button'
import { useAuthRequest } from 'expo-auth-session'
import { useEffect, useState } from 'react'
import { clientId, discovery, getRedirectUri, onAuth0SuccessfulLogin } from '../../logic/authentication'
import { Colors } from '@/constants/Colors'
import { logUserOutOfFirebase, selectUser } from '@/store/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from '@/components/info/Links'


const NotLoggedIn = ({ loadingUser, onButtonPress }) => {
  return (
    <>
      <Button
        label={loadingUser ? <ActivityIndicator style={{ height: 17 }} color={'#fff'} /> : 'Log In or Sign Up'}
        onPress={onButtonPress}
        style={styles.logInButton}
        backgroundColor={Colors.light.lightestBlue}
      />
      <Text>
        Signing up allows you to synchronize your progress with our server, so that you never lose your data.
      </Text>
    </>
  )
}

const LoggedIn = ({ user, onSignOut, onDeleteAccount }) => {
  return (<>
    <Link
      title={user.email}
      subtitle={'Push the button to remove all data and sign out from this device'}
      iconName={'user'}
      onPress={onSignOut}
    />
    <Button
      label={'Sign out'}
      onPress={onSignOut}
      style={styles.logInButton}
      backgroundColor={Colors.light.lightestBlue}
    />
    <Link
      title={'Delete account'}
      subtitle={'Delete your user account and data'}
      iconName={'slash'}
      onPress={onSignOut}
    />
  </>)
}

const LoginSection = () => {
  const [loadingUser, setLoadingUser] = useState(false)
  const user = useSelector(selectUser)
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId,
      redirectUri: getRedirectUri(),
      scopes: ['openid', 'profile', 'email', 'user_metadata'],
      responseType: 'token id_token',
      extraParams: {
        // none is required for an id_token response type
        nonce: Math.random().toString(36),
      },
    },
    discovery,
  )

  const dispatch = useDispatch()
  useEffect(() => {
    (async () => {
      if (response?.type === 'success') {
        setLoadingUser(true)
        try {
          await onAuth0SuccessfulLogin(response, dispatch)
        } catch (e) {
          console.error('Error logging in:', e)
        } finally {
          setLoadingUser(false)
        }
      }
    })()
  }, [response])

  const onSignOut = () => {
    dispatch(logUserOutOfFirebase())
  }

  const onDeleteAccount = () => {

  }

  return (
    <View>
      <Header>
        User Account
      </Header>
      {!user.isLoggedIn && <NotLoggedIn
        loadingUser={loadingUser}
        onButtonPress={() => {
          promptAsync()
        }}
      />}
      {user.isLoggedIn && <LoggedIn
        user={user}
        onSignOut={onSignOut}
        onDeleteAccount={}
      />}

    </View>
  )
}

const styles = StyleSheet.create({
  logInButton: {
    marginVertical: 12,
  },
})


export default LoginSection
