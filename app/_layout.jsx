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

export default function RootLayout() {
  const colorScheme = useColorScheme()
  const [loadedData, setLoadedData] = useState(false)
  const [loadedFonts] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    Barkentina: require('../assets/fonts/Barkentina.ttf'),
  })

  // Initial app configuration
  useEffect(() => {
    // Load
    store.dispatch(loadData()).finally(() => {
      setLoadedData(true)
    })

    // Register react-native-track-player
    TrackPlayer.setupPlayer()
  }, [])

  if (!loadedFonts || !loadedData) {
    return null
  }


  return (
    <Provider store={store}>
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

          {/* Create custom meditation screens*/}
          <Stack.Screen
            name="create-custom-meditation"
            options={{
              title: 'Create Session',
              headerStyle: {
                backgroundColor: Colors.light.electricBlue,
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Barkentina',
                fontSize: 22,
                color: '#fff',
              },
            }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </Provider>
  )
}
