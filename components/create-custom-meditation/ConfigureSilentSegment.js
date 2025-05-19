import { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { formatSecondsForDisplayInWords } from '../../util'
import Slider from '@react-native-community/slider'
import { Colors } from '../../constants/Colors'
import Button from '../ui/Button'
import { createSilentMeditationSegments } from '../configure-silent-timer/SilentMeditationLogic'
import { FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons'


const ConfigureSilentSegment = ({ addMeditationSegment }) => {
  const [durationInSeconds, setDurationInSeconds] = useState(30 * 60) // 30 minutes
  const [isIndefinite, setIsIndefinite] = useState(false)
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {!isIndefinite ?
          formatSecondsForDisplayInWords(durationInSeconds) :
          <FontAwesome6 name={'infinity'} size={18} />
        }
      </Text>
      <Slider
        value={durationInSeconds}
        onValueChange={(value) => {
          setIsIndefinite(false)
          setDurationInSeconds(value)
        }}
        minimumValue={0}
        maximumValue={60 * 60 * 3} // 3 hours
        step={60}
        style={{ width: '100%' }}
        disabled={isIndefinite}
        minimumTrackTintColor={Colors.light.electricBlue}
      />
      <Button
        label={
          <View style={styles.buttonLabelContainer}>
            {!isIndefinite
              ? <FontAwesome6 name={'infinity'} size={16} color={Colors.light.electricBlue} />
              : <MaterialCommunityIcons name={'timer'} size={16} color={Colors.light.electricBlue} />
            }
            <Text style={styles.buttonLabelText}>
              {`  ${!isIndefinite ? 'Set Indefinite' : 'Set Countdown'}`}
            </Text>
          </View>
        }
        onPress={() => {
          setIsIndefinite(!isIndefinite)
        }}
        alternative={true}
        backgroundColor={Colors.light.electricBlue}
      />
      <Button
        label={'Add'}
        onPress={() => {
          addMeditationSegment({
            type: 'Silent',
            isIndefinite,
            durationInSeconds: isIndefinite ? -1 : durationInSeconds,
            segments: createSilentMeditationSegments({
              meditationLength: durationInSeconds,
            }),
            contentfulContentType: 'meditationSegments',
          })
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 32,
    rowGap: 12,
    backgroundColor: '#fff',
    flex: 1,
  },
  label: {
    width: '100%',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 600,
    marginBottom: 16,
  },
  buttonLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonLabelText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.electricBlue,
  },
})

export default ConfigureSilentSegment
