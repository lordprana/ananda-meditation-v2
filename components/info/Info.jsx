import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native'
import LoginSection from './LoginSection'
import React from 'react'
import Links from '@/components/info/Links'
import About from '@/components/info/About'
import DonateButton from '@/components/ui/DonateButton'

const Info = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <LoginSection />
        <Links />
        <About />
        <DonateButton />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 20,
    rowGap: 32,
  },
})

export default Info
