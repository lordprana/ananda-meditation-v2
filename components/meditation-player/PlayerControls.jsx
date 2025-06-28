import Slider from '@react-native-community/slider'
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, Platform, View } from 'react-native'
import { Ionicons, MaterialCommunityIcons, SimpleLineIcons } from '@expo/vector-icons'
import FadeView from '../ui/FadeView'
import { useOrientation } from '../../hooks/useOrientation'

const PlayerControls = ({
                          hidden,
                          togglePlay,
                          forwardTen,
                          backTen,
                          seekTo,
                          toggleDim,
                          finishMeditation,
                          duration,
                          currentPosition,
                          isPlaying,
                          isBackgroundDimmed,
                          mediaLoaded,
                          isIndefiniteMeditation,
                          onFinish,
                        }) => {
  const iconColor = 'rgba(255, 255, 255, 0.9)'
  const orientation = useOrientation()
  console.log('PlayerControls rendered')
  return (
    // key={orientation} forces a redraw when the orientation changes
    <FadeView key={orientation} hidden={hidden} style={styles.playerControlsContainer}>
      {/* The below TouchableOpacity is needed to prevent touches from going up to the parent and hiding the controls*/}
      {mediaLoaded && <TouchableOpacity activeOpacity={1} style={styles.touchableContainer}>
        <View style={styles.videoPlaybackButtonsRow}>
          <TouchableOpacity onPress={backTen}>
            <MaterialCommunityIcons name={'rewind-10'} size={30} color={iconColor} />
          </TouchableOpacity>
          <TouchableOpacity onPress={togglePlay}>
            {!isPlaying && <Ionicons name={'play-outline'} size={Platform.select({ ios: 70, android: 68, })} color={iconColor} />}
            {isPlaying && <SimpleLineIcons name={'control-pause'} size={Platform.select({ ios: 50, android: 49, })} style={{ paddingBottom: 9.5, padding: 9, paddingRight: 11 }}
                                           color={iconColor} />}
          </TouchableOpacity>
          <TouchableOpacity onPress={forwardTen}>
            <MaterialCommunityIcons name={'fast-forward-10'} size={30} color={iconColor} />
          </TouchableOpacity>

        </View>
        <View style={styles.largeButtonsRow}>
          <TouchableOpacity style={[styles.button, styles.outlineButton]} onPress={toggleDim}>
            <Text style={styles.dimText}>
              {!isBackgroundDimmed ? 'DIM SCREEN' : 'LIGHT SCREEN'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.solidButton]} onPress={onFinish}>
            <Text style={styles.finishText}>
              FINISH
            </Text>
          </TouchableOpacity>

        </View>
        <Slider
          minimumValue={0}
          maximumValue={duration}
          value={++currentPosition}
          onSlidingComplete={(value) => seekTo(value)}
          minimumTrackTintColor={'rgba(255, 255, 255, 0.9)'}
          maximumTrackImage={'rgba(255, 255, 255, 0.5)'}
          thumbTintColor={'rgba(255, 255, 255, 0.9)'}
          style={{ opacity: isIndefiniteMeditation ? 0 : 1 }}
        />
      </TouchableOpacity>}
      {!mediaLoaded && <View style={styles.loadingContainer}>
        <ActivityIndicator size={'large'} color={'rgba(255, 255, 255, 0.9)'} />
      </View>}
    </FadeView>

  )
}

const styles = StyleSheet.create({
  playerControlsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(58,86,246,0.7)',
    padding: 8,
    height: '25%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
  },
  touchableContainer: {
    rowGap: '3%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  videoPlaybackButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  largeButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  button: {
    padding: 12,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    width: '46%',
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  solidButton: {
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  dimText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: 500,
  },
  finishText: {
    fontWeight: 500,
  },
})

export default PlayerControls
