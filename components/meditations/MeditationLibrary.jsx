import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native'
import MeditationTile from './MeditationTile'
import GroupTile from '@/components/meditations/GroupTile'
import TimerTiles from '@/components/meditations/TimerTiles'
import Header from '@/components/ui/Header'
import DonateButton from '@/components/ui/DonateButton'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import AndroidAwareSafeAreaView from '@/components/ui/AndroidAwareSafeAreaView'

const SECTION_TYPES = {
  meditations: 'meditations',
  meditationGroups: 'meditation_groups',
  timers: 'timers',
}

export const LibrarySection = ({ title, children, style, noScroll=false }) => {
  return (
    <View style={[styles.sectionContainer, style]}>
      <Header style={styles.sectionTitle}>
        {title}
      </Header>
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
  const { top, bottom } = useSafeAreaInsets()
  return (
    <AndroidAwareSafeAreaView>
      <ScrollView style={styles.outerContainer} contentContainerStyle={{ paddingBottom: 20 }}>
        {content?.map((section) => {
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
        {showDonateButton && content?.length > 0 && <DonateButton />}
      </ScrollView>
    </AndroidAwareSafeAreaView>
  )
}

const styles = StyleSheet.create({
  outerContainer: {
    padding: 16,
  },
  sectionContainer: {
    marginBottom: 40
  },
  sectionTitle: {
    marginBottom: 12
  },
  scrollingContainer: {
    flexDirection: 'row',
    columnGap: 12
  },
})

export default MeditationLibrary
