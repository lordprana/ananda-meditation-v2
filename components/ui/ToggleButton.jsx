import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import { Colors } from '../../constants/Colors'

const ToggleButton = ({
                        selected,
                        onToggle,
                        label,
                        style,
                      }) => {
  const styles = getStyles({ selected })
  return (
    <TouchableOpacity onPress={onToggle} style={[style, styles.container]}>
      <Text style={styles.text}>
        {label}
      </Text>
    </TouchableOpacity>
  )
}

const getStyles = ({ selected }) => StyleSheet.create({
  container: {
    backgroundColor: selected ? Colors.light.lightestBlue : '#fff',
    borderWidth: 1,
    borderColor: Colors.light.lightestBlue,
    borderRadius: 80,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: selected ? '#fff' : Colors.light.lightestBlue,
    fontWeight: 600,
  },
})

export default ToggleButton
