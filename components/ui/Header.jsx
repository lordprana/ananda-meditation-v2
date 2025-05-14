import { StyleSheet, Text } from 'react-native'
import { Colors } from '../../constants/Colors'

const Header = ({ children, style }) => {
  return (
    <Text style={[styles.header, style]}>
      { children }
    </Text>
  )
}

const styles = StyleSheet.create({
  header: {
    fontSize: 32,
    fontFamily: 'Barkentina',
    color: Colors.light.lightestBlue,
  }
})

export default Header
