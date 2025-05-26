import React, { useState } from 'react';
import { Modal, View, Text, Button, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { formatSecondsForDisplayInWords } from '../../util'

export default function DurationSliderModal({ visible, onClose, value, setValue }) {
  const [tempValue, setTempValue] = useState(value);

  const handleCancel = () => {
    setTempValue(value); // Reset to original value
    onClose();
  };

  const handleOk = () => {
    setValue(tempValue);
    onClose();
  };

  console.log(tempValue, 'tempValue')
  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.container}>
        <Text style={styles.title}>Duration</Text>
        <Text style={styles.durationLabel}>{formatSecondsForDisplayInWords(tempValue)}</Text>

        <Slider
          style={styles.slider}
          minimumValue={60}
          maximumValue={60 * 60 * 3}
          step={60}
          value={tempValue}
          onValueChange={setTempValue}
          minimumTrackTintColor="#6200EE"
          maximumTrackTintColor="#ccc"
          thumbTintColor="#6200EE"
        />

        <View style={styles.buttonRow}>
          <Button title="Cancel" onPress={handleCancel} />
          <Button title="OK" onPress={handleOk} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
  },
  durationLabel: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 40,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 40,
  },
});
