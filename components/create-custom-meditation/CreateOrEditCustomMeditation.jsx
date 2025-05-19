import { useEffect, useMemo, useRef, useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { Colors } from '../../constants/Colors'
import { TextInput } from 'react-native-paper'
import Button from '../ui/Button'
import { MaterialIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useDispatch } from 'react-redux'
import {
  addCustomMeditationById,
  getNewCustomMeditationId, removeCustomMeditationById,
  updateCustomMeditationTitle,
} from '../../store/customMeditationsSlice'
import debounce from 'lodash.debounce'

const Segments = ({ segments }) => {
  if (!segments || segments.length === 0) {
    return <Text>
      No Tracks
    </Text>
  }
}

const ButtonLabel = ({ text, iconName, color }) => {
  return <View style={styles.buttonLabelContainer}>
    <MaterialIcons name={iconName} size={16} color={color} style={styles.buttonLabelIcon} />
    <Text style={[styles.buttonLabelText, { color }]}>
      {text}
    </Text>
  </View>
}

const CreateOrEditCustomMeditation = ({
                                        customMeditation = {},
                                      }) => {
  const {
    segments,
    title,
    thumbnailUrl,
    contentfulId
  } = useMemo(() => {
    return customMeditation || { contentfulId: getNewCustomMeditationId() }
  }, [customMeditation])

  const [newMeditationTitle, setNewMeditationTitle] = useState(title || 'Untitled')
  const [meditationSegments, setMeditationSegments] = useState(segments || [])
  const [savePressed, setSavePressed] = useState(false)
  const textInputRef = useRef(null)
  const router = useRouter()
  const dispatch = useDispatch()
  useEffect(() => {
    if (!customMeditation) {
      dispatch(addCustomMeditationById(contentfulId))
    }
  }, [])
  useEffect(() => {
    return () => {
      if (savePressed) {
        dispatch(updateCustomMeditationTitle({
          id: contentfulId,
          title: newMeditationTitle,
        }))

      } else {
        dispatch(removeCustomMeditationById(contentfulId))
      }
    }
  }, [])

  return (
    <Pressable
      style={styles.backgroundView}
      onPress={() => textInputRef.current.blur()}
    >
      <ScrollView style={styles.innerContainer}>
        <TextInput
          ref={textInputRef}
          label={'Title'}
          value={newMeditationTitle}
          onChangeText={setNewMeditationTitle}
          activeUnderlineColor={Colors.light.electricBlue}
          selectionColor={Colors.light.electricBlue}
          cursorColor={Colors.light.electricBlue}
          activeOutlineColor={Colors.light.electricBlue}
          mode={'flat'}
          style={{
            marginBottom: 16,
            backgroundColor: 'transparent',
          }}
        />
        <Button
          alternative={true}
          label={<ButtonLabel
            color={Colors.light.electricBlue}
            text={'Background'}
            iconName={'image'}
          />}
          backgroundColor={Colors.light.electricBlue}
          style={styles.button}
        />
        <Button
          alternative={true}
          label={<ButtonLabel
            color={Colors.light.electricBlue}
            text={'Add Track'}
            iconName={'playlist-add'}
          />}
          backgroundColor={Colors.light.electricBlue}
          style={styles.button}
          onPress={() => router.push(`pick-custom-meditation-track/${contentfulId}`)}
        />
        <Segments segments={meditationSegments} />
      </ScrollView>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  backgroundView: {
    flex: 1,
    backgroundColor: Colors.light.electricBlue,
  },
  innerContainer: {
    flex: 1,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 16,
    backgroundColor: '#fff',
  },
  buttonLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: 6
  },
  button: {
    marginVertical: 12,
  },
  buttonLabelText: {
    fontSize: 14,
    fontWeight: '600',
  },
  buttonLabelIcon: {
    width: 16,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  }
})

export default CreateOrEditCustomMeditation
