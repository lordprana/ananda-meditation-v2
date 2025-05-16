import { Platform, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Header from '../ui/Header'
import Feather from '@expo/vector-icons/Feather'
import Constants from 'expo-constants'

export const Link = ({ key, title, subtitle, onPress, iconName, url }) => {
  return <TouchableOpacity
    key={key}
    style={styles.linkRow}
    onPress={onPress || (() => Linking.openURL(url))}
    disabled={!url}
  >
    <Feather name={iconName} size={24} color="#aaa"/>
    <View style={styles.linkText}>
      <Text style={styles.linkTitle}>
        {title}
      </Text>
      {subtitle && <Text style={styles.linkSubtitle}>
        {subtitle}
      </Text>}
    </View>
  </TouchableOpacity>
}

const Links = () => {

  const getFeedbackUrl = () => {
    const email = 'meditationapp@ananda.org'
    const subject = 'Feedback on the Meditation App'
    const appVersion = Constants.expoConfig?.version
    const os = Platform.OS
    const osVersion = Platform.Version
    const body = `\n\nHelpful Information: Version ${appVersion}\n${os} version ${osVersion}`
    return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }


  const linkData = [
    {
      title: 'Learn more about meditation',
      subtitle: 'Online and in-person classes, books, and videos',
      iconName: 'book-open',
      url: 'https://www.ananda.org/meditation/?utm_source=AnandaMeditationApp&utm_medium=app',
    },
    {
      title: 'Privacy Policy',
      iconName: 'info',
      url: 'https://www.ananda.org/privacy-policy?utm_source=AnandaMeditationApp&utm_medium=app',
    },
    {
      title: 'Feedback',
      subtitle: 'Send us an email: meditationapp@ananda.org',
      iconName: 'mail',
      url: getFeedbackUrl(),
    },
  ]
  return (
    <View>
      <Header>
        Links
      </Header>
      {linkData.map((link, index) => (
        <Link
          key={index}
          title={link.title}
          subtitle={link.subtitle}
          iconName={link.iconName}
          url={link.url}
        />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    columnGap: 12,
  },
  linkText: {
    flexShrink: 1,
  },
  linkTitle: {
    fontWeight: 600,
    fontSize: 15,
  },
  linkSubtitle: {
    fontSize: 13,
    color: '#666',
  },
})

export default Links
