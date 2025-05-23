import { View, StyleSheet, Text, ScrollView } from 'react-native'
import { Colors } from '../../constants/Colors'
import { parseISO, format } from 'date-fns'
import { formatSecondsForDisplayInLetters, formatSecondsForDisplayInWords } from '../../util'
import Button from '../ui/Button'

const ViewLogs = ({ logs }) => {
  console.log(logs)
  const monthMap = logs.reduce((acc, log) => {
    const month = format(new Date(log.timestamp * 1000), 'MMMM yyyy')
    if (acc[month]) {
      acc[month].push(log)
    } else {
      acc[month] = [log]
    }
    return acc
  }, {})
  return (
    <View style={styles.backgroundView}>
      <ScrollView style={styles.scrollContainerStyle} contentContainerStyle={styles.innerContainer}>
        {Object.keys(monthMap).map((month) =>
          <View key={month}>
            <Text style={styles.monthHeader}>{month}</Text>
            <View style={styles.logs}>
              {monthMap[month].map((log) => (
                <View key={log.timestamp} style={styles.logEntry}>
                  <View style={styles.firstLogRow}>
                    <Text style={styles.logText}>{format(new Date(log.timestamp * 1000), 'MMM dd, yyyy')}</Text>
                    <Text style={styles.logText}>{formatSecondsForDisplayInLetters(log.duration, true)}</Text>
                  </View>
                  <Text style={styles.logText}>
                    {log.title}
                  </Text>
                </View>
              ))}
            </View>
          </View>,
        )}
      </ScrollView>
      <Button label={'Add Log'} style={styles.addLogButton}/>
    </View>
  )
}

const styles = StyleSheet.create({
  backgroundView: {
    flex: 1,
    backgroundColor: Colors.light.electricBlue,
  },
  scrollContainerStyle: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    flex: 1,
  },
  innerContainer: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 16,
    paddingTop: 24,
    paddingBottom: 120,
    backgroundColor: '#fff',
    rowGap: 22,
  },
  monthHeader: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  logs: {
    rowGap: 12,
  },
  firstLogRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logText: {
    fontSize: 16,
  },
  addLogButton: {
    position: 'absolute',
    bottom: 36,
    left: 16,
    right: 16,
  }
})

export default ViewLogs
