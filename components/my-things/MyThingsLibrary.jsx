import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import { LibrarySection } from '../meditations/MeditationLibrary'
import Button from '@/components/ui/Button'
import { useSelector } from 'react-redux'
import { selectFavoriteMeditationIds } from '@/store/favoriteMeditationsSlice'
import { selectItemByContentfulId } from '@/store/meditationLibrariesSlice'
import IonIcons from '@expo/vector-icons/Ionicons'
import { Colors } from '@/constants/Colors'
import MeditationTile from '@/components/meditations/MeditationTile'
import { useRouter } from 'expo-router'
import { selectCustomMeditations } from '@/store/customMeditationsSlice'

const MyThingsLibrary = ({}) => {
  const customMeditations = useSelector(selectCustomMeditations)
  const favoriteMeditationIds = useSelector(selectFavoriteMeditationIds)
  const favoriteMeditations = useSelector(state =>
    favoriteMeditationIds.map(id =>
      selectItemByContentfulId(id)(state)),
  )
  const router = useRouter()
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <LibrarySection title={'Custom Sessions'} noScroll={customMeditations.length === 0}>
          {customMeditations.length === 0 &&
            <Text style={styles.helperText}>
              Create guided meditation experiences that are unique to you.
            </Text>
          }
          {customMeditations.map((meditation) =>
            <MeditationTile
              key={meditation.contentfulId}
              meditation={meditation}
              hideToggleVideoButton={true}
              isCustomMeditation={true}
            />,
          )}
        </LibrarySection>
        <Button
          label={'Add a custom session'}
          style={{ marginTop: -20 }}
          onPress={() => {
            router.push('create-custom-meditation/newCustomMeditation')
          }} />
        <LibrarySection title={'Favorites'} noScroll={favoriteMeditations.length === 0} style={styles.favoritesSection}>
          {favoriteMeditations.length === 0 &&
            <View style={styles.noFavoritesContainer}>
              <Text style={styles.helperText}>
                Add favorites by tapping on the heart on a session.
              </Text>
              <Text style={styles.helperText}>
                Go ahead and try it now!
              </Text>
              <IonIcons name={'heart'} size={40} color={Colors.light.electricBlue} style={styles.heartIcon} />
            </View>
          }
          {favoriteMeditations.map((meditation) => <MeditationTile key={meditation.contentfulId}
                                                                   meditation={meditation} />)}
        </LibrarySection>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  favoritesSection: {
    marginTop: 40,
  },
  helperText: {
    fontSize: 14,
    color: '#999',
  },
  noFavoritesContainer: {
    width: '100%',
  },
  heartIcon: {
    marginTop: 8,
    alignSelf: 'center',
  },
})

export default MyThingsLibrary
