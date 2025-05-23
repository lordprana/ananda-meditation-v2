import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import FontAwesomeIcon from '@expo/vector-icons/FontAwesome5'
import React from 'react'
import { Colors } from '../../constants/Colors'
import { useRouter } from 'expo-router'

const GroupTile = ({
                     fontAwesomeIconName,
                     contentfulId,
                     title,
                     meditations,
                   }) => {
  const router = useRouter()
  return (
    <TouchableOpacity style={styles.videoTile}
                      onPress={() => router.push(`/meditation-group/${encodeURIComponent(contentfulId)}`)}>
      <Text style={styles.videoCount}>
        {meditations.length}
      </Text>
      <View style={styles.topHalfContainer}>
        <FontAwesomeIcon name={fontAwesomeIconName} size={40} color={'#fff'} />
      </View>
      <View style={styles.bottomHalfContainer}>
        <Text style={styles.title}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  videoTile: {
    width: 150,
    height: 150,
    backgroundColor: Colors.light.lightestBlue,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    alignItems: 'center',
    padding: 8,
  },
  videoCount: {
    fontSize: 14,
    fontWeight: 500,
    color: '#fff',
    position: 'absolute',
    top: 8,
    right: 8,
  },
  title: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 600,
    color: '#fff',
  },
  topHalfContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  bottomHalfContainer: {
    flex: 1,
  }
})

export default GroupTile
