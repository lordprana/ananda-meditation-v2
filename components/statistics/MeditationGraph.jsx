import React, { useMemo } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { format, parse } from 'date-fns'
import { Colors } from '@/constants/Colors'
import { Area, CartesianChart, Line, Scatter } from 'victory-native'
import { formatSecondsForDisplayInLetters } from '@/util'
import { useFont } from '@shopify/react-native-skia'
import font from '@/assets/fonts/SpaceMono-Regular.ttf'

const MeditationGraph = ({ logs }) => {
  const dataByDate = useMemo(() => {
    const map = {}

    logs.forEach((log) => {
      const date = format(new Date(log.timestamp * 1000), 'yyyy-MM-dd')
      map[date] = (map[date] || 0) + log.duration
    })

    const sortedDates = Object.keys(map).sort()

    return sortedDates.map((date) => ({
      date,
      totalMinutes: Math.round(map[date] / 60),
    }))
  }, [logs])

  const chartFont = useFont(font, 12)
  const chartColor = Colors.light.electricBlue
  const verticalOffset = 20
  const horizontalOffset = 30
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meditation Minutes per Day</Text>
      <View style={styles.chartContainer}>
        <CartesianChart
          data={dataByDate}
          xKey={'date'}
          domainPadding={{ left:  horizontalOffset, right: horizontalOffset, bottom: verticalOffset, top: verticalOffset }}
          padding={{ bottom: -20}}
          yKeys={['totalMinutes']}
          xAxis={{
            font: chartFont,
            axisSide: 'bottom',
            labelRotate: 45,
            labelOffset: 4,
            formatXLabel: (value) => {
              try {
                if (!value) return ''

                const parsedDate = parse(value, 'yyyy-MM-dd', new Date())

                // Check if the parsed date is valid
                if (isNaN(parsedDate)) return ''

                const formattedDate = format(parsedDate, 'M/d')
                console.log(formattedDate)
                return formattedDate
              } catch (e) {
                console.log('error parsing date')
              }
            },
          }}
          yAxis={[{
            font: chartFont,
            labelOffset: 16,
            formatYLabel: (value) => {
              return formatSecondsForDisplayInLetters(value * 60)
            },
          }]}
        >
          {({ points, chartBounds }) => {
            console.log(points.totalMinutes)
            console.log(chartBounds)
            return (
              <>
                <Area
                  points={points.totalMinutes}
                  color={chartColor}
                  opacity={.2}
                  strokeWidth={3}
                  y0={chartBounds.bottom}
                />
                <Line
                  points={points.totalMinutes}
                  color={chartColor}
                  strokeWidth={3}
                />
                <Scatter
                  points={points.totalMinutes}
                  shape="circle"
                  radius={5}
                  style="fill"
                  color={chartColor}
                />
              </>
            )
          }}
        </CartesianChart>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    margin: 0,
    flex: 1,
  },
  chartContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    marginBottom: 16,
    fontFamily: 'SpaceMono',
    textAlign: 'center',
  },
})

export default MeditationGraph
