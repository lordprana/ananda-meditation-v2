import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { SafeAreaView } from 'react-native'

const AndroidAwareSafeAreaView = ({ children }) => {
  const { top } = useSafeAreaInsets()
  return (
    <SafeAreaView style={{ flex: 1, paddingTop: top }}>
      {children}
    </SafeAreaView>
  )
}

export default AndroidAwareSafeAreaView
