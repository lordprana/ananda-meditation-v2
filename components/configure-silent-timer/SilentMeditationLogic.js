import { Asset } from 'expo-asset'
import { addSilentMeditation, createCustomMeditationContentfulId } from '../../store/meditationLibrariesSlice'
import { getNewCustomMeditationId } from '@/store/customMeditationsSlice'

const endBellAssetDuration = 21 // seconds

const silenceComposition = (lengthInSeconds) => {
  const silenceDenominations =
    [1800, 600, 300, 120, 60, 30, 10, 5, 2, 1] // Must be in DESC order
  const silenceCompositionResult = []
  for (const denom of silenceDenominations) {
    while (lengthInSeconds >= denom) {
      silenceCompositionResult.push(denom)
      lengthInSeconds -= denom
    }
  }
  return silenceCompositionResult
}

const getMeditationSegmentsForExtraBell = (meditationLengthInSeconds, extraBellPartwayThroughPercentage, silenceUris) => {
  const preBellDuration = Math.floor(meditationLengthInSeconds * extraBellPartwayThroughPercentage)
  const postBellDuration = meditationLengthInSeconds - preBellDuration - endBellAssetDuration
  return [
    ...silenceComposition(preBellDuration).map((segmentLength, index) => ({
      contentfulId: `preBellSilence${index}`,
      duration: segmentLength,
      title: 'Silence',
      audioUrl: silenceUris[`${segmentLength}s`],
    })),
    {
      contentfulId: 'midBell',
      duration: endBellAssetDuration,
      title: 'Silence',
      audioUrl: silenceUris[`bell`],
    },
    ...silenceComposition(postBellDuration).map((segmentLength, index) => ({
      contentfulId: `postBellSilence${index}`,
      duration: segmentLength,
      title: 'Silence',
      audioUrl: silenceUris[`${segmentLength}s`],
    })),
  ]
}

const prependOpeningAndAppendClosingToSegments = ({
                                                    hasOpeningPrayer,
                                                    hasOpeningChant,
                                                    hasClosingAffirmation,
                                                    hasClosingPrayer,
                                                    meditationSegments,
                                                    silenceUris,
                                                  }) => {
  // const hasClosingBell = !hasClosingAffirmation && !hasClosingPrayer
  const hasClosingBell = false // for now there will never be a closing bell. Uncommenting the top line will append a closing bell if there is no other closing sound
  const newResults = [...meditationSegments]

  const additions = [
    { condition: hasOpeningChant, position: 'start', type: 'chant' },
    { condition: hasOpeningPrayer, position: 'start', type: 'prayer' },
    { condition: hasClosingAffirmation, position: 'end', type: 'affirmation' },
    { condition: hasClosingPrayer, position: 'end', type: 'prayer' },
    { condition: hasClosingBell, position: 'end', type: 'bell' },
  ]

  additions.forEach(({ condition, position, type }, index) => {
    if (!condition) return
    const segment = {
      contentfulId: `${position}${index}`,
      duration: type === 'bell' ? endBellAssetDuration : 30,
      title: `${position}${type}`,
      audioUrl: type === 'bell' ? silenceUris['bell'] : silenceUris['30s'],
    }
    position === 'start' ? newResults.unshift(segment) : newResults.push(segment)
  })

  return newResults
}

export const createSilentMeditationSegments = async ({
                                        meditationLength, // In seconds
                                        hasOpeningPrayer = false,
                                        hasOpeningChant = false,
                                        hasClosingAffirmation = false,
                                        hasClosingPrayer = false,
                                        extraBellPartwayThroughPercentage = 0,
                                      }) => {
  const silenceAssets = {
    '1800s': require('../../assets/audio/silence/silence-1800s.mp3'),
    '600s': require('../../assets/audio/silence/silence-600s.mp3'),
    '300s': require('../../assets/audio/silence/silence-300s.mp3'),
    '120s': require('../../assets/audio/silence/silence-120s.mp3'),
    '60s': require('../../assets/audio/silence/silence-60s.mp3'),
    '30s': require('../../assets/audio/silence/silence-30s.mp3'),
    '10s': require('../../assets/audio/silence/silence-10s.mp3'),
    '5s': require('../../assets/audio/silence/silence-5s.mp3'),
    '2s': require('../../assets/audio/silence/silence-2s.mp3'),
    '1s': require('../../assets/audio/silence/silence-1s.mp3'),
    'bell': require('../../assets/audio/bell.mp3'),
  }

  const silenceUris = {}
  await Promise.all(Object.keys(silenceAssets).map(async (key) => {
    const asset = Asset.fromModule(silenceAssets[key])
    await asset.downloadAsync()
    silenceUris[key] = asset.localUri || asset.uri
  }))

  let meditationSegments

  if (extraBellPartwayThroughPercentage > 0) {
    meditationSegments = getMeditationSegmentsForExtraBell(
      meditationLength,
      extraBellPartwayThroughPercentage,
      silenceUris,
    )
  } else {
    meditationSegments = [
      ...silenceComposition(meditationLength).map((segmentLength, index) => ({
        contentfulId: `${getNewCustomMeditationId()}${index}`,
        duration: segmentLength,
        title: 'Silence',
        audioUrl: silenceUris[`${segmentLength}s`],
      })),
    ]
  }
  console.log(meditationSegments, 'pre append')
  meditationSegments = prependOpeningAndAppendClosingToSegments({
    meditationSegments,
    hasOpeningChant,
    hasOpeningPrayer,
    hasClosingAffirmation,
    hasClosingPrayer,
    silenceUris,
  })
  return meditationSegments
}

const createSilentMeditation = async (silentMeditationArgs) => {
  return {
    title: 'Silent Meditation',
    contentfulId: createCustomMeditationContentfulId(),
    segments: await createSilentMeditationSegments(silentMeditationArgs),
  }
}

export const navigateToSilentMeditation = async ({
                                                   meditationLength,
                                                   hasOpeningPrayer = false,
                                                   hasOpeningChant = false,
                                                   hasClosingAffirmation = false,
                                                   hasClosingPrayer = false,
                                                   extraBellPartwayThroughPercentage = 0,
                                                 }, dispatch, router) => {
  const meditation = await createSilentMeditation({
    meditationLength,
    hasOpeningPrayer,
    hasOpeningChant,
    hasClosingAffirmation,
    hasClosingPrayer,
    extraBellPartwayThroughPercentage,
  })
  dispatch(addSilentMeditation(meditation))
  // Navigate to the meditation player
  router.push(`/meditation-player/${encodeURIComponent(meditation.contentfulId)}`)
}
