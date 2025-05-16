import { Platform, View } from 'react-native'
import Header from '../ui/Header'
import { Link } from './Links'
import Constants from 'expo-constants'

const About = () => {
  const appVersion = Constants.expoConfig?.version
  const os = Platform.OS
  const osVersion = Platform.Version
  return (
    <View>
      <Header>
        About
      </Header>
      <Link
        title={'About This App and Device'}
        subtitle={`Version ${appVersion}\n${os} ${osVersion}`}
        iconName={'help-circle'}
        url={''}
        />
    </View>
  )
}

export default About
