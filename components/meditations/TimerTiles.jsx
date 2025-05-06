import React from 'react'
import { View, Text, Pressable, StyleSheet, Dimensions } from 'react-native'
import tinycolor from 'tinycolor2'

const { width } = Dimensions.get('window')
const tileMargin = 8
const numColumnsTop = 4
const outerHorizontalPadding = 32
const tileSize = (width - outerHorizontalPadding - tileMargin * (numColumnsTop + 1)) / numColumnsTop

function generateGradientColors(startColor, endColor, steps) {
  const start = tinycolor(startColor)
  const end = tinycolor(endColor)
  const colors = []
  for (let i = 0; i < steps; i++) {
    const ratio = i / (steps - 1)
    colors.push(tinycolor.mix(start, end, ratio * 100).toHexString())
  }
  return colors
}

const TimerTiles = ({ startColor = '#b1d0ff', endColor = '#1d57a5' }) => {
  const gradientColors = generateGradientColors(startColor, endColor, 7)
  const timers = [5, 10, 15, 20, 30, 60]
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {gradientColors.slice(0, 4).map((color, idx) => (
          <Pressable key={idx} style={[styles.tile, { backgroundColor: color }]}>
            <Text style={styles.tileText}>{timers[idx]} min</Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.row}>
        {gradientColors.slice(4, 6).map((color, idx) => (
          <Pressable key={idx + 4} style={[styles.tile, { backgroundColor: color }]}>
            <Text style={styles.tileText}>{timers[idx + 4]} min</Text>
          </Pressable>
        ))}
        <Pressable style={[styles.tile, styles.doubleTile, { backgroundColor: gradientColors[6] }]}>
          <Text style={styles.tileText}>Custom</Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: tileMargin,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tile: {
    width: tileSize,
    height: 50,
    marginRight: tileMargin,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  doubleTile: {
    width: tileSize * 2 + tileMargin, // spans 2 tiles
  },
  tileText: {
    color: 'white',
    fontWeight: 600,
    textAlign: 'center',
  },
})

export default TimerTiles
