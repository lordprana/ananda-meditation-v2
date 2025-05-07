import { FlatList, ScrollView, StyleSheet, View } from 'react-native'
import VideoTile from '../meditations/VideoTile'

const MeditationGroup = ({
                           groupName,
                         }) => {
  // Select meditations from the group
  const meditations = [
    {
      title: 'How to Meditate',
      duration: '13:09',
      thumbnailUrl: 'https://firebasestorage.googleapis.com/v0/b/ananda-meditation.appspot.com/o/kirtan_a_2.jpg?alt=media&token=1be68609-de42-4db6-a53a-6c1c15e2a336',
      videoUrl: 'https://firebasestorage.googleapis.com/v0/b/ananda-meditation.appspot.com/o/energization_exercises_gyandev_part4_v3.mp4?alt=media&token=a6354931-fb2b-463b-b9bc-b0f4ef489c80',
    },
    {
      title: 'How to Meditate',
      duration: '13:09',
      thumbnailUrl: 'https://firebasestorage.googleapis.com/v0/b/ananda-meditation.appspot.com/o/kirtan_a_2.jpg?alt=media&token=1be68609-de42-4db6-a53a-6c1c15e2a336',
      videoUrl: 'https://example.com/video1.mp4',
    },
    {
      title: 'How to Meditate',
      duration: '13:09',
      thumbnailUrl: 'https://firebasestorage.googleapis.com/v0/b/ananda-meditation.appspot.com/o/kirtan_a_2.jpg?alt=media&token=1be68609-de42-4db6-a53a-6c1c15e2a336',
      videoUrl: 'https://example.com/video1.mp4',
    },
    {
      title: 'How to Meditate',
      duration: '13:09',
      thumbnailUrl: 'https://firebasestorage.googleapis.com/v0/b/ananda-meditation.appspot.com/o/kirtan_a_2.jpg?alt=media&token=1be68609-de42-4db6-a53a-6c1c15e2a336',
      videoUrl: 'https://example.com/video1.mp4',
    },
    {
      title: 'How to Meditate',
      duration: '13:09',
      thumbnailUrl: 'https://firebasestorage.googleapis.com/v0/b/ananda-meditation.appspot.com/o/kirtan_a_2.jpg?alt=media&token=1be68609-de42-4db6-a53a-6c1c15e2a336',
      videoUrl: 'https://example.com/video1.mp4',
    },
  ]
  return (
    <View style={styles.outerContainer}>
      <FlatList
        data={meditations}
        renderItem={({ item }) => (
          <VideoTile
            style={{ width: '49%', marginBottom: 10 }}
            key={item.videoUrl}
            title={item.title}
            duration={item.duration}
            videoUrl={item.videoUrl}
            thumbnailUrl={item.thumbnailUrl}
          />
        )}
        keyExtractor={(item) => item.videoUrl}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: 'space-between'
      }}
      />

    </View>
  )
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingBottom: 32,
    paddingHorizontal: 4
  },
})

export default MeditationGroup
