import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import { Colors as Color } from '../../constants/Colors'

const Button = ({
                  label,
                  onPress,
                  style,
                  backgroundColor,
                  borderColor,
                  alternative = false,
                  disabled = false,
                }) => {
  const styles = getStyles({ alternative, backgroundColor, disabled, borderColor })
  return (
    <TouchableOpacity style={[styles.container, style]} onPress={onPress} disabled={disabled}>
      <Text style={styles.text}>
        {label}
      </Text>
    </TouchableOpacity>
  )
}

const getStyles = ({ alternative, backgroundColor, disabled, borderColor }) => StyleSheet.create({
  container: {
    backgroundColor: alternative ? 'transparent' : backgroundColor || Color.light.electricBlue,
    borderWidth: 1,
    borderColor: borderColor || alternative ? backgroundColor || Color.light.lightestBlue : backgroundColor || Color.light.electricBlue,
    borderRadius: 80,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: disabled ? 0.5 : 1,
  },
  text: {
    color: alternative ? backgroundColor || Color.light.lightestBlue : '#fff',
    fontWeight: 600,
    textAlign: 'center',
  },
})

export default Button
