import { FlatList, StyleSheet, View } from 'react-native'
import MeditationTile from '../meditations/MeditationTile'
import { getMeditationDuration } from '../../store/meditationLibrariesSlice'

const MeditationGroup = ({
                           group,
                         }) => {
  // Select meditations from the group
  const { meditations } = group
  return (
    <View style={styles.outerContainer}>
      <FlatList
        data={meditations}
        renderItem={({ item }) => (
          <MeditationTile
            style={{ marginBottom: 10, marginHorizontal: 4 }}
            key={item.contentfulId}
            meditation={item}
          />
        )}
        keyExtractor={(item) => item.contentfulId}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: 'flex-between',
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
    paddingTop: 16,
    paddingHorizontal: 4,
  },
})

export default MeditationGroup
