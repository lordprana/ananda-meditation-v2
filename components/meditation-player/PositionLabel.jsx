import { StyleSheet, Text, View } from 'react-native'
import { formatSecondsForDisplay } from '../../util'

const PositionLabel = ({ currentPosition, segments, duration }) => {
  const getSegmentIndex = (position) => {
    let totalDuration = 0
    for (let i = 0; i < segments.length; i++) {
      totalDuration += segments[i].duration
      if (position < totalDuration) {
        return i
      }
    }
    return -1 // Return -1 if no segment is found
  }

  const segmentIndex = getSegmentIndex(currentPosition)
  const segment = segments[segmentIndex]
  const timeRemaining = duration - currentPosition

  if (!segment) {
    return null
  }

  return (
    <View style={styles.positionLabelContainer}>
      <Text style={styles.positionText}>
        {formatSecondsForDisplay(timeRemaining)}
      </Text>
      <Text style={styles.segmentTitleText}>
        {segment.title}
      </Text>
      {/*The below component is for centering the title*/}
      <Text style={[styles.positionText, { opacity: 0 }]}/>
    </View>
  )
}

const styles = StyleSheet.create({
  positionLabelContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    paddingBottom: 20,
    paddingHorizontal: 18,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between'
  },
  positionText: {
    color: '#fff',
    fontWeight: 600,
    width: 54,
    textAlign: 'right',
  },
  segmentTitleText: {
    color: '#fff',
    fontWeight: 400,
    textAlign: 'center',
  },
})

export default PositionLabel
