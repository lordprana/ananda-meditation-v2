import { formatSecondsForDisplayInLetters, formatSecondsForDisplayInWords } from '../../util'
import { useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { parseISO, isValid, formatISO, addDays } from 'date-fns'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { Colors } from '@/constants/Colors'

function getMaxConsecutiveMeditationDays(logs) {
  const dates = logs
    .map((log) => log.timestamp)
    .sort((a, b) => a - b) // sort ascending

  let maxStreak = 0
  let currentStreak = 0
  let prevDate = null

  for (const date of dates) {
    if (prevDate) {
      const nextDay = addDays(prevDate, 1)
      const isConsecutive = formatISO(nextDay, { representation: 'date' }) === formatISO(date, { representation: 'date' })

      currentStreak = isConsecutive ? currentStreak + 1 : 1
    } else {
      currentStreak = 1
    }

    maxStreak = Math.max(maxStreak, currentStreak)
    prevDate = date
  }

  return maxStreak
}

const MeditationStats = ({ logs }) => {
  console.log(logs)
  const stats = useMemo(() => [
    {
      statName: 'Total Time',
      value: formatSecondsForDisplayInLetters(logs.reduce((acc, log) => acc + log.duration, 0), true),
      iconName: 'access-time',
    },
    {
      statName: 'Total Sessions',
      value: logs.length,
      iconName: 'self-improvement'
    },
    {
      statName: 'Longest Session',
      value: formatSecondsForDisplayInLetters(Math.max(...logs.map(log => log.duration)), true),
      iconName: 'looks-one',
    },
    {
      statName: 'Maximum Consecutive Days',
      value: getMaxConsecutiveMeditationDays(logs),
      iconName: 'trending-up'
    },
  ], [logs])
  return (
    <View style={styles.container}>
      {stats.map((stat) => {
        return (
          <View key={stat.statName} style={styles.statContainer}>
            <MaterialIcons name={stat.iconName} color={Colors.light.electricBlue} size={24} />
            <Text style={styles.statName}>{stat.statName}</Text>
            <Text style={styles.statValue}>{stat.value}</Text>
          </View>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    rowGap: 18,
    marginBottom: 40,
  },
  statContainer: {
    flexDirection: 'row',
    columnGap: 6,
    width: '100%',
    alignItems: 'center',
  },
  statName: {
    fontSize: 18,
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 600,

  },
})

export default MeditationStats
