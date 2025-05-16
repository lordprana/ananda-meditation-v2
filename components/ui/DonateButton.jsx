import { Linking, StyleSheet, Text, TouchableOpacity } from 'react-native'
import FontAwesomeIcon from '@expo/vector-icons/FontAwesome6'
import { Colors } from '../../constants/Colors'

const DonateButton = () => {
 return (
   <TouchableOpacity
     style={styles.donateButton}
     onPress={() => Linking.openURL(
       'https://www.ananda.org/support/?utm_source=AnandaMeditationApp&utm_medium=app'
     )}
   >
     <FontAwesomeIcon name={'hand-holding-heart'} size={18} color={'#fff'} />
     <Text style={styles.donateButtonTitle}>
       Donate
     </Text>
   </TouchableOpacity>
 )
}

const styles = StyleSheet.create({
  donateButton: {
    backgroundColor: Colors.light.lightestBlue,
    padding: 12,
    borderRadius: 120,
    flexDirection: 'row',
    justifyContent: 'center',
    columnGap: 8,
    alignItems: 'center',
    marginTop: 8
  },
  donateButtonTitle: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 500
  },
})

export default DonateButton
