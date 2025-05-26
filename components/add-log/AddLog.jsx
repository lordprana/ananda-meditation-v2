import { format } from 'date-fns'
import { useEffect, useState } from 'react'
import { updateLog } from '../../store/meditationLogsSlice'
import { useDispatch } from 'react-redux'
import { Platform, ScrollView, Share, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { Colors } from '../../constants/Colors'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import Feather from '@expo/vector-icons/Feather'
import { formatSecondsForDisplayInWords } from '../../util'
import Button from '../ui/Button'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useNavigation, useRouter } from 'expo-router'
import { Audio } from 'expo-av'
import DonateButton from '../ui/DonateButton'
import DurationSliderModal from './DurationSliderModal'

const AddLog = ({ logTimestamp, existingLog, isFirstCompletion }) => {
  const navigation = useNavigation()
  useEffect(() => {
    (async () => {
      if (existingLog && !isFirstCompletion) {
        navigation.setOptions({
          headerTitle: 'Edit Log',
        })
      } else if (isFirstCompletion) {
        navigation.setOptions({
          headerTitle: 'Meditation Complete!',
        })

        // Play end bell
        const { sound } = await Audio.Sound.createAsync(
          require('@/assets/audio/bell.mp3'), // or remote URI
        )
        await sound.playAsync()
      }
    })()
  }, [existingLog])
  const date = format(new Date(logTimestamp * 1000), 'MMMM dd, yyyy')
  const time = format(new Date(logTimestamp * 1000), 'hh:mm a')
  const [duration, setDuration] = useState(existingLog ? existingLog.duration : 30 * 60)
  const [durationModalVisible, setDurationModalVisible] = useState(false)
  const [journalEntry, setJournalEntry] = useState(existingLog ? existingLog.journalEntry : '')
  const dispatch = useDispatch()
  const { bottom } = useSafeAreaInsets()
  const router = useRouter()
  const saveLog = () => {
    dispatch(updateLog({
      timestamp: +logTimestamp,
      duration: +duration,
      journalEntry,
      title: existingLog?.title,
    }))
  }
  const saveLogAndGoBack = () => {
    saveLog()
    router.back()
  }
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      e.preventDefault()
      if (isFirstCompletion) {
        saveLog()
      }
      navigation.dispatch(e.data.action)
    })
    return unsubscribe
  }, [isFirstCompletion, journalEntry, duration, logTimestamp, existingLog])
  return (
    <View style={styles.backgroundView}>
      <DurationSliderModal
        visible={durationModalVisible}
        onClose={() => setDurationModalVisible(false)}
        setValue={setDuration}
        value={duration}
      />
      <ScrollView style={styles.scrollContainerStyle}
                  contentContainerStyle={{ ...styles.innerContainer, paddingBottom: bottom + 8 }}>
        {existingLog?.title && <View style={styles.rowContainer}>
          <MaterialIcons name={'title'} size={24} color={Colors.light.electricBlue} />
          <Text style={styles.labelText}>Title: </Text>
          <Text style={styles.valueText}>{existingLog.title}</Text>
        </View>}
        <View style={styles.rowContainer}>
          <MaterialIcons name={'calendar-today'} size={24} color={Colors.light.electricBlue} />
          <Text style={styles.labelText}>Date: </Text>
          <Text style={styles.valueText}>{date}</Text>
        </View>
        <View style={styles.rowContainer}>
          <MaterialIcons name={'access-time'} size={24} color={Colors.light.electricBlue} />
          <Text style={styles.labelText}>Time: </Text>
          <Text style={styles.valueText}>{time}</Text>
        </View>
        <TouchableOpacity
          style={styles.rowContainer}
          onPress={() => setDurationModalVisible(true)}
          disabled={isFirstCompletion}
        >
          <MaterialIcons name={'hourglass-bottom'} size={24} color={Colors.light.electricBlue} />
          <Text style={styles.labelText}>Duration: </Text>
          <Text style={styles.valueText}>{formatSecondsForDisplayInWords(duration)}</Text>
        </TouchableOpacity>
        <View style={styles.rowContainer}>
          <Feather name={'feather'} size={24} color={Colors.light.electricBlue} />
          <Text style={styles.labelText}>Journal Entry:</Text>
        </View>
        <TextInput
          value={journalEntry}
          onChangeText={setJournalEntry}
          placeholder="Write a journal entry"
          multiline
          style={styles.textInput}
        />
        <View style={styles.buttonsContainer}>
        {isFirstCompletion &&
          <Button
            alternative={true}
            label={'Share'}
            onPress={() => {
              Share.share({
                message: `I just finished meditating for ${formatSecondsForDisplayInWords(duration)} with the Ananda Meditation App.`,
                url: Platform.select({
                  ios: 'https://apps.apple.com/us/app/ananda-meditation/id1151716464'
                }),
              })
            }}
          />}
        {isFirstCompletion && <DonateButton />}
        {!isFirstCompletion && <Button label="Save Log" onPress={saveLogAndGoBack} style={styles.saveButton} />}
        </View>
      </ScrollView>
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
    backgroundColor: '#fff',
    rowGap: 22,
    flex: 1,
    justifyContent: 'space-between',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 12,
  },
  labelText: {
    flex: 1,
  },
  textInput: {
    borderRadius: 32,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, .4)',
    padding: 16,
    flex: 1,
  },
  buttonsContainer: {
    rowGap: 4
  }

})

export default AddLog
