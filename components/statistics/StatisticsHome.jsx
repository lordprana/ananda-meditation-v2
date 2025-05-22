import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import { FontAwesome6 } from '@expo/vector-icons'
import React from 'react'
import Button from '@/components/ui/Button'

const StatisticsHome = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.noLogMessageContainer}>
          <Text style={styles.noLogsText}>
            Complete 3 or more sessions to see the statistics!
          </Text>
          <FontAwesome6 name={'chart-line'} size={40} color={'#888'} />
        </View>
        <Button label={'See Logs'} />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    padding: 20,
    flex: 1,
  },
  noLogMessageContainer: {
    alignItems: 'center',
    flex: 1,
  },
  noLogsText: {
    fontSize: 15,
    color: '#888',
    textAlign: 'center',
    marginBottom: 16,
  },
})
export default StatisticsHome
