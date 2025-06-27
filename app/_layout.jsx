import 'react-native-gesture-handler'

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import 'react-native-reanimated'

import { useColorScheme } from '@/hooks/useColorScheme'
import { useEffect, useState } from 'react'
import { loadData, store } from '@/store/store'
import { Provider } from 'react-redux'
import { Colors } from '@/constants/Colors'
import TrackPlayer from 'react-native-track-player'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import * as SplashScreen from 'expo-splash-screen'

export default function RootLayout() {
  const colorScheme = useColorScheme()
  const [loadedData, setLoadedData] = useState(false)
  const [loadedFonts] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    Barkentina: require('../assets/fonts/Barkentina.ttf'),
  })

  // Initial app configuration
  useEffect(() => {
    (async () => {
      // Load
      await store.dispatch(loadData())
      setLoadedData(true)
    })()
  }, [])

  useEffect(() => {
    (async () => {
      if (loadedData && loadedFonts) {
        await SplashScreen.hideAsync()
        // Only initialize Track Player after first render to avoid issues with crash
        // Register Track Player background service
        TrackPlayer.registerPlaybackService(() => require('../trackPlayerService'));
        TrackPlayer.setupPlayer()
      }
    })()
  }, [loadedFonts, loadedData])

  if (!loadedFonts || !loadedData) {
    return null
  }


  const blueHeaderOptions = {
    headerStyle: {
      backgroundColor: Colors.light.electricBlue,
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontFamily: 'Barkentina',
      fontSize: 22,
      color: '#fff',
    },
  }


  return (
    <GestureHandlerRootView>
      <Provider store={store}>
        <SafeAreaProvider>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack screenOptions={{
              headerStyle: {
                backgroundColor: '#fff',
              },
              headerTintColor: '#000',
              headerTitleStyle: {
                fontFamily: 'Barkentina',
                fontSize: 22,
                color: Colors.light.lightestBlue,
              },
              headerShadowVisible: false,
              headerBackButtonDisplayMode: 'minimal',
              headerTitleAlign: 'left',
            }}>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen
                name={'meditation-group/[contentfulId]'}
              />
              <Stack.Screen
                name={'meditation-player/[meditationId]'}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name={'configure-silent-timer'}
                options={{ title: 'Silent Timer' }}
              />

              <Stack.Screen
                name="view-logs"
                options={{
                  title: 'Logs',
                  ...blueHeaderOptions,
                }} />

              <Stack.Screen
                name="add-log/[logTimestamp]"
                options={{
                  title: 'Add Log',
                  ...blueHeaderOptions,
                }} />

              {/* Create custom meditation screens*/}
              <Stack.Screen
                name="create-custom-meditation/[contentfulId]"
                options={{
                  title: 'Create Session',
                  ...blueHeaderOptions,
                }} />
              <Stack.Screen
                name="pick-custom-meditation-track/[contentfulId]"
                options={{
                  title: 'Pick Track',
                  headerTitleStyle: {
                    fontFamily: 'Barkentina',
                    fontSize: 22,
                    color: '#000',
                  },
                }} />
              <Stack.Screen
                name="pick-custom-meditation-image/[contentfulId]"
                options={{
                  title: 'Background',
                  headerTitleStyle: {
                    fontFamily: 'Barkentina',
                    fontSize: 22,
                    color: '#000',
                  },
                }} />
              <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="auto" />
          </ThemeProvider>
        </SafeAreaProvider>
      </Provider>
    </GestureHandlerRootView>
  )
}
