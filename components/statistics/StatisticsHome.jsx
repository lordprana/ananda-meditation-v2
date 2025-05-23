import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import { FontAwesome6 } from '@expo/vector-icons'
import React from 'react'
import Button from '@/components/ui/Button'
import { parseISO } from 'date-fns'
import MeditationGraph from '@/components/statistics/MeditationGraph'
import MeditationStats from '@/components/statistics/MeditationStats'

const StatisticsHome = () => {
  const logs = [
    {
      duration: 160,
      timestamp: Math.floor(parseISO('2024-12-22T00:11:52', 'yyyy-MM-dd', new Date()).getTime() / 1000),
    },
    {
      duration: 160,
      timestamp: Math.floor(parseISO('2025-05-23T00:11:52', 'yyyy-MM-dd', new Date()).getTime() / 1000),
    },
    {
      duration: 160,
      timestamp: Math.floor(parseISO('2025-05-23T00:11:53', 'yyyy-MM-dd', new Date()).getTime() / 1000),
    },
    {
      duration: 160,
      timestamp: Math.floor(parseISO('2025-11-24T00:11:53', 'yyyy-MM-dd', new Date()).getTime() / 1000),
    },
  ]
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {logs.length < 3 && <View style={styles.noLogMessageContainer}>
          <Text style={styles.noLogsText}>
            Complete 3 or more sessions to see the statistics!
          </Text>
          <FontAwesome6 name={'chart-line'} size={40} color={'#888'} />
        </View>}
        {logs.length >= 3 && <View style={styles.statsContainer}>
          <MeditationGraph logs={logs} />
          <MeditationStats logs={logs} />
        </View>
        }
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
    justifyContent: 'space-between',
  },
  noLogMessageContainer: {
    alignItems: 'center',
  },
  noLogsText: {
    fontSize: 15,
    color: '#888',
    textAlign: 'center',
    marginBottom: 16,
  },
  statsContainer: {
    flex: 1,
  }
})
export default StatisticsHome
