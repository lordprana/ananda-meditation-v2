import { Button, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import MeditationTile from './MeditationTile'
import { Colors } from '@/constants/Colors'
import GroupTile from '@/components/meditations/GroupTile'
import TimerTiles from '@/components/meditations/TimerTiles'
import FontAwesomeIcon from '@expo/vector-icons/FontAwesome6'
import { getMeditationDuration } from '@/store/meditationLibrariesSlice'

const SECTION_TYPES = {
  meditations: 'meditations',
  meditationGroups: 'meditation_groups',
  timers: 'timers',
}

export const LibrarySection = ({ title, children, style, noScroll=false }) => {
  return (
    <View style={[styles.sectionContainer, style]}>
      <Text style={styles.sectionTitle}>
        {title}
      </Text>
      <ScrollView horizontal={!noScroll} contentContainerStyle={styles.scrollingContainer}>
        {children}
      </ScrollView>
    </View>
  )
}

const MeditationLibrary = ({
                             content,
                             showDonateButton,
                           }) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.outerContainer} contentContainerStyle={{ paddingBottom: 80 }}>
        {content.map((section) => {
            if (section.type === SECTION_TYPES.meditations) {
              return (
                <LibrarySection key={section.contentfulId} title={section.title}>
                  {
                    section.items.map((meditation) => (
                      <MeditationTile
                        key={meditation.contentfulId}
                        meditation={meditation}
                      />
                    ))
                  }
                </LibrarySection>
              )
            } else if (section.type === SECTION_TYPES.meditationGroups) {
              return (
                <LibrarySection key={section.contentfulId} title={section.title}>
                  {
                    section.items.map((group) => (
                      <GroupTile
                        key={group.contentfulId}
                        contentfulId={group.contentfulId}
                        title={group.title}
                        meditations={group.meditations}
                        fontAwesomeIconName={group.fontAwesomeIconName}
                      />
                    ))
                  }
                </LibrarySection>
              )
            } else if (section.type === SECTION_TYPES.timers) {
              return (
                <LibrarySection noScroll={true} key={section.contentfulId} title={section.title}>
                  <TimerTiles />
                </LibrarySection>
              )
            }
          },
        )}
        {showDonateButton && (
          <TouchableOpacity style={styles.donateButton}>
            <FontAwesomeIcon name={'hand-holding-heart'} size={18} color={'#fff'} />
            <Text style={styles.donateButtonTitle}>
              Donate
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  outerContainer: {
    padding: 16
  },
  sectionContainer: {
    marginBottom: 40
  },
  sectionTitle: {
    fontSize: 32,
    fontFamily: 'Barkentina',
    color: Colors.light.lightestBlue,
    marginBottom: 12
  },
  scrollingContainer: {
    flexDirection: 'row',
    columnGap: 12
  },
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

export default MeditationLibrary
