import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import FontAwesomeIcon from '@expo/vector-icons/FontAwesome5'
import React from 'react'
import { Colors } from '../../constants/Colors'
import { useNavigation, useRouter } from 'expo-router'

const GroupTile = ({
                     fontAwesomeIconCode,
                     title,
                     videos,
                   }) => {
  const router = useRouter()
  return (
    <TouchableOpacity style={styles.videoTile} onPress={() => router.push(`/meditation-group/${encodeURIComponent(title)}`)}>
      <Text style={styles.videoCount}>
        {videos.length}
      </Text>
      <FontAwesomeIcon name={fontAwesomeIconCode} size={40} color={'#fff'} />
      <Text style={styles.title}>
        {title}
      </Text>
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
    padding: 8
  },
  videoCount: {
    alignSelf: 'flex-end',
    fontSize: 14,
    fontWeight: 500,
    color: '#fff'
  },
  title: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 600,
    color: '#fff',
  },
})

export default GroupTile
