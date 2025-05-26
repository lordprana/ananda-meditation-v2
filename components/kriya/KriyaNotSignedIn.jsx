import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, Linking, View } from 'react-native'
import Header from '../ui/Header'
import Button from '../ui/Button'
import { TextInput } from 'react-native-paper'
import { forwardRef, useEffect, useRef, useState } from 'react'
import { Colors } from '@/constants/Colors'
import remoteConfig from '@react-native-firebase/remote-config'
import { useDispatch } from 'react-redux'
import { setIsKriyaban, setIsKriyabanAsync } from '@/store/userSlice'

const kriyaEmailAddress = 'kriyayoga@ananda.org'
const kriyaEmailAddressIndia = 'kriyasupport@anandaindia.org'
const kriyaLearnMoreLink = 'https://www.ananda.org/kriya-yoga/?utm_source=AnandaMeditationApp&utm_medium=app'


const WhatIsKriyaYogaSection = () => {
  return (
    <View>
      <Header style={styles.headerText}>
        What Is Kriya Yoga?
      </Header>
      <Text>
        An ancient meditation technique of energy control, which Paramhansa Yogananda called &#34;the jet airplane route
        to
        God&#34;.
        {'\n'}
        {'\n'}
        It is also a comprehensive spiritual path which includes additional meditation practices and right living.
      </Text>
      <Button
        label={'Learn More'}
        style={styles.button}
        onPress={() => {
          Linking.openURL(kriyaLearnMoreLink)
        }}
        alternative={true}
      />

    </View>
  )
}

const ForKriyabansSection = forwardRef((_, ref) => {
  const kriyaNecessaryInfo = [
    'Name',
    'Street Address',
    'City',
    'State and Postal Code',
    'Country',
    'Email Address',
    'When did you receive Kriya initiation from Ananda?',
    'Where?',
    'From whom?',
  ]
  const [kriyaInputPassword, setKriyaInputPassword] = useState('')
  const [kriyaPassword, setKriyaPassword] = useState(null)
  const [incorrectPassword, setIncorrectPassword] = useState(false)
  const passwordInputColor = incorrectPassword ? Colors.light.errorRed : Colors.light.lightestBlue
  const dispatch = useDispatch()

  // Fetch the kriya key from firebase remote config
  useEffect(() => {
    remoteConfig().fetchAndActivate()
      .then(fetchedRemotely => {
        const kriyaKey = remoteConfig().getValue('kriya_Key').asString()
        setKriyaPassword(kriyaKey)
        console.log(kriyaKey)
      })
  }, [])

  const checkKriyaPassword = () => {
    if (kriyaPassword === kriyaInputPassword) {
      dispatch(setIsKriyaban(true))
    } else {
      setIncorrectPassword(true)
      setKriyaInputPassword('')
    }
  }
  return (
    <View>
      <Header style={styles.headerText}>
        For Ananda Sangha Kriyabans
      </Header>
      <TextInput
        ref={ref}
        mode={'outlined'}
        label={'Password'}
        value={kriyaInputPassword}
        autoCapitalize={'none'}
        autoCorrect={false}
        onChangeText={text => {
          setIncorrectPassword(false)
          setKriyaInputPassword(text)
        }}
        underlineColor={passwordInputColor}
        activeUnderlineColor={passwordInputColor}
        selectionColor={passwordInputColor}
        cursorColor={passwordInputColor}
        textColor={passwordInputColor}
        theme={{
          colors: {
            placeholder: passwordInputColor, // Or any color code
            text: passwordInputColor,
            onSurfaceVariant: passwordInputColor,
          },
        }}
        outlineColor={incorrectPassword ? Colors.light.errorRed : 'rgba(51, 136, 204, .4)'}
        activeOutlineColor={passwordInputColor}
        style={{
          backgroundColor: 'transparent',
        }}
      />
      {incorrectPassword &&
        <Text style={styles.incorrectPasswordText}>
          Incorrect password. Please try again.
        </Text>
      }
      <Button
        label={'Get Access'}
        onPress={checkKriyaPassword}
        alternative={true}
        style={styles.button}
      />
      <Text>
        If you received Kriya from Ananda, but don&#39;t have your login information, please email us with the following
        information.
        {'\n'}
        {'\n'}
        {kriyaNecessaryInfo.map((info) => `•  ${info}\n`)}
        {'\n'}
        Send email to:
        {'\n'}
        {'\n'}
        {kriyaEmailAddress} (Everywhere except India)
        {'\n'}
        {'\n'}
        {kriyaEmailAddressIndia} (India)
      </Text>

    </View>
  )
})

const KriyaNotSignedIn = () => {
  const passwordInputRef = useRef(null)
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Pressable style={styles.container} onPress={() => passwordInputRef.current.blur()}>
          <WhatIsKriyaYogaSection />
          <ForKriyabansSection ref={passwordInputRef} />
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  headerText: {
    marginBottom: 12,
  },
  button: {
    marginVertical: 16,
  },
  incorrectPasswordText: {
    color: Colors.light.errorRed,
    marginTop: 6,
  },
})

export default KriyaNotSignedIn
