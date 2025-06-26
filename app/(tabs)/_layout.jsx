import { Tabs } from 'expo-router'
import React from 'react'
import { Platform, StyleSheet, Text, View } from 'react-native'

import { HapticTab } from '@/components/HapticTab'
import { IconSymbol } from '@/components/ui/IconSymbol'
import { useColorScheme } from '@/hooks/useColorScheme'
import { Image } from 'expo-image'
import { Colors } from '@/constants/Colors'
import FontAwesomeIcon from '@expo/vector-icons/FontAwesome6'
import FontAwesomeIcon5 from '@expo/vector-icons/FontAwesome5'
import { useSelector } from 'react-redux'
import { selectMeditationLibrary } from '../../store/meditationLibrariesSlice'
import IonIcons from '@expo/vector-icons/Ionicons'

const NoContent = () => {
  return (
    <View style={styles.noContentView}>
      <IonIcons name={'cloud-offline'} size={48} color={'#777'} />
      <Text style={styles.offlineText}>
        There was an error retrieving content. You may be offline. Please exit the app and try again with a network
        connection.
      </Text>
    </View>
  )
}

export default function TabLayout() {
  const colorScheme = useColorScheme()
  const colors = Colors[colorScheme ?? 'light']

  const getTabBarStyle = (backgroundColor) => Platform.select({
    default: {
      height: 80,
      paddingTop: 4,
      paddingHorizontal: 6,
      backgroundColor,
    },
  })
  const content = useSelector(selectMeditationLibrary)
  console.log('content', content)
  if (!content) {
    return <NoContent />
  }
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.5)',
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Meditation',
          tabBarIcon: ({ focused }) =>
            <Image
              style={[{
                width: undefined,
                height: iconSize,
                aspectRatio: 336 / 384,
              }, !focused && { opacity: 0.5 }]}
              source={require('@/assets/images/tab-bar-icons/lotus-icon.png')}
            />,
          tabBarStyle: getTabBarStyle(colors.lightestBlue),
        }}
      />
      <Tabs.Screen
        name="my-things"
        options={{
          title: 'My Things',
          tabBarIcon: ({ color }) =>
            <FontAwesomeIcon
              size={iconSize}
              name="user"
              color={color}
            />,
          tabBarStyle: getTabBarStyle(colors.electricBlue),
        }}
      />
      <Tabs.Screen
        name="kriya"
        options={{
          title: 'Kriya',
          tabBarIcon: ({ focused }) =>
            <Image
              style={[styles.tabIcon, !focused && { opacity: 0.5 }]}
              source={require('@/assets/images/tab-bar-icons/rose-small.png')}
            />,
          tabBarStyle: getTabBarStyle(colors.goldenYellow),
        }}
      />
      <Tabs.Screen
        name="statistics"
        options={{
          title: 'Statistics',
          tabBarIcon: ({ color }) =>
            <FontAwesomeIcon
              size={iconSize}
              name="bar-chart"
              color={color}
            />,
          tabBarStyle: getTabBarStyle(colors.electricBlue),
        }}
      />
      <Tabs.Screen
        name="info"
        options={{
          title: 'Info',
          tabBarIcon: ({ color }) =>
            <FontAwesomeIcon5
              size={iconSize}
              name="info-circle"
              color={color}
            />,
          tabBarStyle: getTabBarStyle(colors.lightestBlue),
        }}
      />
    </Tabs>
  )
}

const iconSize = 24
const styles = StyleSheet.create({
  tabIcon: {
    width: iconSize,
    height: iconSize,
  },
  noContentView: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    rowGap: 12,
  },
  offlineText: {
    textAlign: 'center',
    color: '#777',
  },
})
