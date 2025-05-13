import React from 'react'
import { View, Text, Pressable, StyleSheet, Dimensions, TouchableOpacity } from 'react-native'
import tinycolor from 'tinycolor2'
import { useDispatch } from 'react-redux'
import { Asset } from 'expo-asset'
import {
  addCustomMeditation,
  addSilentMeditation,
  createCustomMeditationContentfulId,
} from '@/store/meditationLibrariesSlice'
import { useRouter } from 'expo-router'

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

const silenceComposition = (meditationLength) => {
  const silenceDenominations = [30, 10, 5, 2, 1]
  const silenceCompositionResult = []
  for (const denom of silenceDenominations) {
    while (meditationLength >= denom) {
      silenceCompositionResult.push(denom)
      meditationLength -= denom
    }
  }

  return silenceCompositionResult

}

export const navigateToSilentMeditation = async (dispatch, router, meditationLength) => {
  const silenceAssets = {
    '30m': require('../../assets/audio/silence/silence-30m.mp3'),
    '10m': require('../../assets/audio/silence/silence-10m.mp3'),
    '5m': require('../../assets/audio/silence/silence-5m.mp3'),
    '2m': require('../../assets/audio/silence/silence-2m.mp3'),
    '1m': require('../../assets/audio/silence/silence-1m.mp3'),
  }
  const meditation = {
    title: 'Silent Meditation',
    contentfulId: createCustomMeditationContentfulId(),
    segments: silenceComposition(meditationLength).map(async (segmentLength, index) => {
      const asset = Asset.fromModule(silenceAssets[`${segmentLength}m`])
      await asset.downloadAsync() // ensures it's available locally
      const uri = asset.localUri || asset.uri
      return {
        contentfulId: index,
        duration: segmentLength,
        title: 'Silence',
        audioUrl: uri,
      }
    }),
  }
  dispatch(addSilentMeditation(meditation))
  // Navigate to the meditation player
  router.push(`/meditation-player/${encodeURIComponent(meditation.contentfulId)}`)
}

const TimerTiles = ({ startColor = '#b1d0ff', endColor = '#1d57a5' }) => {
  const gradientColors = generateGradientColors(startColor, endColor, 7)
  const timers = [5, 10, 15, 20, 30, 60]
  const dispatch = useDispatch()
  const router = useRouter()
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {gradientColors.slice(0, 4).map((color, idx) => (
          <TouchableOpacity
            key={idx}
            style={[styles.tile, { backgroundColor: color }]}
            onPress={() => navigateToSilentMeditation(dispatch, router, timers[idx])}
          >
            <Text style={styles.tileText}>{timers[idx]} min</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.row}>
        {gradientColors.slice(4, 6).map((color, idx) => (
          <TouchableOpacity
            key={idx + 4}
            style={[styles.tile, { backgroundColor: color }]}
            onPress={() => navigateToSilentMeditation(dispatch, router, timers[idx + 4])}
          >
            <Text style={styles.tileText}>{timers[idx + 4]} min</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={[styles.tile, styles.doubleTile, { backgroundColor: gradientColors[6] }]}
          onPress={() => router.push('/configure-silent-timer')}
        >
          <Text style={styles.tileText}>Custom</Text>
        </TouchableOpacity>
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
