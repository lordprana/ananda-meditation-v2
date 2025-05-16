import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import { Colors as Color } from '../../constants/Colors'

const Button = ({
                  label,
                  onPress,
                  style,
                  backgroundColor,
                  alternative = false,
                }) => {
  const styles = getStyles({ alternative, backgroundColor })
  return (
    <TouchableOpacity style={[styles.container, style]} onPress={onPress}>
      <Text style={styles.text}>
        {label}
      </Text>
    </TouchableOpacity>
  )
}

const getStyles = ({ alternative, backgroundColor }) => StyleSheet.create({
  container: {
    backgroundColor: alternative ? 'transparent' : backgroundColor || Color.light.electricBlue,
    borderWidth: 1,
    borderColor: alternative ? Color.light.lightestBlue : backgroundColor || Color.light.electricBlue,
    borderRadius: 80,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: alternative ? backgroundColor || Color.light.lightestBlue : '#fff',
    fontWeight: 600,
    textAlign: 'center',
  },
})

export default Button
