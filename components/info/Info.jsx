import { SafeAreaView, StyleSheet, View } from 'react-native'
import LoginSection from './LoginSection'

const Info = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <LoginSection />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  }
})

export default Info
