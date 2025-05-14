import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import { Colors as Color } from '../../constants/Colors'

const Button = ({
                  label,
                  onPress,
                  style,
                  alternative = false,
                }) => {
  const styles = getStyles({ alternative })
  return (
    <TouchableOpacity style={[styles.container, style]} onPress={onPress}>
      <Text style={styles.text}>
        {label}
      </Text>
    </TouchableOpacity>
  )
}

const getStyles = ({ alternative }) => StyleSheet.create({
  container: {
    backgroundColor: alternative ? 'transparent' : Color.light.electricBlue,
    borderWidth: 1,
    borderColor: alternative ? Color.light.lightestBlue : Color.light.electricBlue,
    borderRadius: 80,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: alternative ? Color.light.lightestBlue : '#fff',
    fontWeight: 600,
    textAlign: 'center',
  },
})

export default Button
