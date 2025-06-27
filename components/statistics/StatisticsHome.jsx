import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import { FontAwesome6 } from '@expo/vector-icons'
import React, { useMemo } from 'react'
import Button from '@/components/ui/Button'
import { parseISO } from 'date-fns'
import MeditationGraph from '@/components/statistics/MeditationGraph'
import MeditationStats from '@/components/statistics/MeditationStats'
import { useRouter } from 'expo-router'
import { useSelector } from 'react-redux'
import { selectLogs } from '@/store/meditationLogsSlice'
import AndroidAwareSafeAreaView from '@/components/ui/AndroidAwareSafeAreaView'

const StatisticsHome = () => {
  const router = useRouter()
  // const logs = [
  //   {
  //     duration: 159,
  //     timestamp: Math.floor(parseISO('2023-12-22T00:11:52', 'yyyy-MM-dd', new Date()).getTime() / 1000),
  //   },
  //   {
  //     duration: 159,
  //     timestamp: Math.floor(parseISO('2024-05-23T00:11:52', 'yyyy-MM-dd', new Date()).getTime() / 1000),
  //   },
  //   {
  //     duration: 159,
  //     timestamp: Math.floor(parseISO('2024-05-23T00:11:53', 'yyyy-MM-dd', new Date()).getTime() / 1000),
  //   },
  //   {
  //     duration: 159,
  //     timestamp: Math.floor(parseISO('2024-11-24T00:11:53', 'yyyy-MM-dd', new Date()).getTime() / 1000),
  //   },
  // ]
  const logs = useSelector(selectLogs)
  return (
    <AndroidAwareSafeAreaView>
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
        <Button label={'See Logs'} onPress={() => router.push('view-logs')} />
      </View>
    </AndroidAwareSafeAreaView>
  )
}

const styles = StyleSheet.create({
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
