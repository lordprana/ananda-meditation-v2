import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import { Colors as Color } from '../../constants/Colors'

const Button = ({
                  label,
                  onPress,
                  style,
                }) => {
  return (
    <TouchableOpacity style={[styles.container, style]} onPress={onPress}>
      <Text style={styles.text}>
        {label}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.light.electricBlue,
    borderRadius: 80,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    color: '#fff',
    fontWeight: 600,
    textAlign: 'center'
  }
})

export default Button
