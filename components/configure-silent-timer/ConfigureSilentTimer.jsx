import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import Slider from '@react-native-community/slider'
import { useState } from 'react'
import ToggleButton from '../ui/ToggleButton'
import { Colors } from '../../constants/Colors'
import Button from '../ui/Button'
import { SegmentedButtons } from 'react-native-paper'
import { navigateToSilentMeditation } from './SilentMeditationLogic'
import { useDispatch } from 'react-redux'
import { useRouter } from 'expo-router'

const ConfigureSilentTimer = () => {
  const [minutes, setMinutes] = useState(10)
  const [hasOpeningPrayer, setHasOpeningPrayer] = useState(false)
  const [hasOpeningChant, setHasOpeningChant] = useState(false)
  const [hasClosingAffirmation, setHasClosingAffirmation] = useState(false)
  const [hasClosingPrayer, setHasClosingPrayer] = useState(false)
  const [extraBellValue, setExtraBellValue] = useState(0)
  const dispatch = useDispatch()
  const router = useRouter()
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <View style={styles.minutesConfigure}>
            <Text style={styles.boldLabel}>
              Minutes
            </Text>
            <View style={styles.sliderRow}>
              <Slider
                value={minutes}
                onValueChange={setMinutes}
                minimumValue={0}
                maximumValue={120}
                step={1}
                style={styles.slider}
                minimumTrackTintColor={Colors.light.lightestBlue}
              />
              <View style={styles.valueBox}>
                <Text style={styles.valueText}>
                  {minutes}
                </Text>
              </View>

            </View>
          </View>
          <View style={styles.includingContainer}>
            <Text style={styles.regularLabel}>
              Including
            </Text>
            <ToggleButton
              label={'Opening Prayer'}
              selected={hasOpeningPrayer}
              onToggle={() => setHasOpeningPrayer(!hasOpeningPrayer)}
            />
            <ToggleButton
              label={'Opening Chant'}
              selected={hasOpeningChant}
              onToggle={() => setHasOpeningChant(!hasOpeningChant)}
            />
            <ToggleButton
              label={'Closing Affirmation'}
              selected={hasClosingAffirmation}
              onToggle={() => setHasClosingAffirmation(!hasClosingAffirmation)}
            />
            <ToggleButton
              label={'Closing Prayer'}
              selected={hasClosingPrayer}
              onToggle={() => setHasClosingPrayer(!hasClosingPrayer)}
            />
          </View>
          <View style={styles.extraBellContainer}>
            <Text style={styles.regularLabel}>
              Extra bell part-way through the session
            </Text>
            <SegmentedButtons
              value={extraBellValue}
              onValueChange={setExtraBellValue}
              style={{
                borderColor: Colors.light.lightestBlue,
              }}
              buttons={[
                {
                  value: 0,
                  label: 'None',
                  style: {
                    backgroundColor: extraBellValue === 0 ? Colors.light.lightestBlue : '#fff',
                    borderColor: Colors.light.lightestBlue,
                  },
                  labelStyle: {
                    color: extraBellValue === 0 ? '#fff' : Colors.light.lightestBlue,
                  },
                },
                {
                  value: 2 / 3,
                  label: '2/3 through',
                  style: {
                    backgroundColor: extraBellValue === 2 / 3 ? Colors.light.lightestBlue : '#fff',
                    borderColor: Colors.light.lightestBlue,
                  },
                  labelStyle: {
                    color: extraBellValue === 2 / 3 ? '#fff' : Colors.light.lightestBlue,
                  },
                },
                {
                  value: 3 / 4,
                  label: '3/4 through',
                  style: {
                    backgroundColor: extraBellValue === 3 / 4 ? Colors.light.lightestBlue : '#fff',
                    borderColor: Colors.light.lightestBlue,
                  },
                  labelStyle: {
                    color: extraBellValue === 3 / 4 ? '#fff' : Colors.light.lightestBlue,
                  },
                },
              ]}
            />
          </View>
        </View>
        <View style={styles.bottomContainer}>
          <Button label={'Let \'s Meditate'} onPress={() => {
            navigateToSilentMeditation({
              meditationLength: minutes,
              hasOpeningPrayer,
              hasClosingPrayer,
              hasClosingAffirmation,
              hasOpeningChant,
              extraBellPartwayThroughPercentage: extraBellValue,
            }, dispatch, router)
          }} />
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    justifyContent: 'space-between',
    flex: 1,
  },
  topContainer: {
    rowGap: 32,
  },
  minutesConfigure: {
    rowGap: 16,
  },
  boldLabel: {
    fontSize: 14,
    fontWeight: 600,
  },
  sliderRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  slider: {
    width: '90%',
  },
  valueBox: {
    padding: 3,
    width: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#888',
  },
  includingContainer: {
    rowGap: 14,
    marginBottom: 20,
  },
  extraBellContainer: {
    rowGap: 12,
  },
})

export default ConfigureSilentTimer
