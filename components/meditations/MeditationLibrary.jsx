import { Button, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import VideoTile from './VideoTile'
import { Colors } from '@/constants/Colors'
import GroupTile from '@/components/meditations/GroupTile'
import TimerTiles from '@/components/meditations/TimerTiles'
import FontAwesomeIcon from '@expo/vector-icons/FontAwesome6'

const LibrarySection = ({ title, children, noScroll=false }) => {
  return (
    <View style={styles.sectionContainer}>
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
                <LibrarySection noScroll={true} key={section.sectionTitle} title={section.sectionTitle}>
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
    paddingVertical: 16,
    paddingHorizontal: 16,
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
