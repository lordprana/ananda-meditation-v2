import { Button, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import VideoTile from './VideoTile'
import { Colors } from '@/constants/Colors'
import GroupTile from '@/components/meditations/GroupTile'

const LibrarySection = ({ title, children }) => {
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>
        {title}
      </Text>
      <ScrollView horizontal>
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
    <SafeAreaView>
      <ScrollView style={styles.outerContainer}>
        {content.map((section, index) => {
            if (section.type === 'videos') {
              return (
                <LibrarySection key={section.sectionTitle} title={section.sectionTitle}>
                  {
                    section.videos.map((video) => (
                      <VideoTile
                        key={video.videoUrl}
                        title={video.title}
                        duration={video.duration}
                        videoUrl={video.videoUrl}
                        thumbnailUrl={video.thumbnailUrl}
                      />
                    ))
                  }
                </LibrarySection>
              )
            } else if (section.type === 'groups') {
              return (
                <LibrarySection key={section.sectionTitle} title={section.sectionTitle}>
                  {
                    section.groups.map((group) => (
                      <GroupTile
                        key={group.groupName}
                        title={group.groupName}
                        videos={group.videos}
                        fontAwesomeIconCode={group.fontAwesomeIconCode}
                      />
                    ))
                  }
                </LibrarySection>
              )
            } else if (section.type === 'timers') {
              return (
                <LibrarySection key={section.sectionTitle} title={section.sectionTitle}>
                  {/*<TimerTiles />*/}
                </LibrarySection>
              )
            }
          },
        )}
        {showDonateButton && (
          <Button title="Donate" onPress={() => alert('Donate button pressed')} />
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  outerContainer: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  sectionContainer: {
    marginBottom: 40
  },
  sectionTitle: {
    fontSize: 32,
    fontFamily: 'Barkentina',
    color: Colors.light.lightestBlue
  }
})

export default MeditationLibrary
