import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import FadeView from '../ui/FadeView'

const PlayerHeader = ({ title, hidden, onBack }) => {
  const router = useRouter()
  const chevronIconSize = 20
  const chevronIconPadding = 12
  const insets = useSafeAreaInsets()
  return (
    <FadeView hidden={hidden} style={[styles.headerContainer, { top: insets.top }]}>
      <TouchableOpacity
        onPress={() => {
          onBack()
          router.back()
        }}
        style={{ padding: chevronIconPadding }}>
        <FontAwesome name={'chevron-left'} size={chevronIconSize} color={'#fff'} />
      </TouchableOpacity>
      <Text style={styles.titleText}>
        {title}
      </Text>
      {/* This View is just here for flex layout purposes*/}
      <View style={{ width: chevronIconSize + chevronIconPadding }} />
    </FadeView>
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
