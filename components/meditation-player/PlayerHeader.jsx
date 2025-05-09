import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { useRouter } from 'expo-router'

const PlayerHeader = ({ title, hidden }) => {
  const router = useRouter()
  const chevronIconSize = 20
  const chevronIconPadding = 12
  return (
    <View style={[styles.headerContainer, { display: hidden ? 'none' : 'flex' }]}>
      <TouchableOpacity onPress={() => router.back()} style={{padding: chevronIconPadding}}>
        <FontAwesome name={'chevron-left'} size={chevronIconSize} color={'#fff'} />
      </TouchableOpacity>
      <Text style={styles.titleText}>
        {title}
      </Text>
      {/* This View is just here for flex layout purposes*/}
      <View style={{width: chevronIconSize + chevronIconPadding}}/>
    </View>
  )
}


const styles = StyleSheet.create({
  headerContainer: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    zIndex: 10,
  },
  titleText: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
  },
})

export default PlayerHeader
