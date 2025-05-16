import { useRef, useState } from 'react'
import { View, StyleSheet, Text, Pressable, ScrollView } from 'react-native'
import { Colors } from '../../constants/Colors'
import { TextInput } from 'react-native-paper'
import Button from '../ui/Button'
import { MaterialIcons } from '@expo/vector-icons'

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
  const { segments, title, thumbnailUrl } = customMeditation
  const [meditationTitle, setMeditationTitle] = useState(title || 'Untitled')
  const [meditationThumbnailUrl, setMeditationThumbnailUrl] = useState(thumbnailUrl || '')
  const [meditationSegments, setMeditationSegments] = useState(segments || [])
  const textInputRef = useRef(null)

  return (
    <Pressable
      style={styles.backgroundView}
      onPress={() => textInputRef.current.blur()}
    >
      <ScrollView style={styles.innerContainer}>
        <TextInput
          ref={textInputRef}
          label={'Title'}
          value={meditationTitle}
          onChangeText={setMeditationTitle}
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
