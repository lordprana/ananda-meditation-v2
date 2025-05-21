import { useSelector } from 'react-redux'
import { selectAllLibraryItemsByCallback } from '../../store/meditationLibrariesSlice'
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { ImageBackground } from 'expo-image'
import { Colors } from '../../constants/Colors'
import React from 'react'

const ImageTile = ({ image, updateImage, style }) => {
  return (
    <TouchableOpacity onPress={() => updateImage(image)} style={[styles.imageOuterContainer, style]}>
    <ImageBackground source={image.portraitUrl} style={styles.imageInnerContainer}>
        <Text style={styles.imageLabel}>
          {image.title}
        </Text>
    </ImageBackground>
    </TouchableOpacity>
  )
}

const PickImageFromCategory = ({ category, updateImage }) => {
  const images = useSelector(selectAllLibraryItemsByCallback((item) =>
    item.category === category &&
    item.contentfulContentType === 'image',
  ))
  return (
    <View style={styles.container}>
      <FlatList
        data={images}
        renderItem={({ item }) => (
          <ImageTile
            style={{ marginBottom: 10, marginHorizontal: 4 }}
            key={item.contentfulId}
            image={item}
            updateImage={updateImage}
          />
        )}
        keyExtractor={(item) => item.contentfulId}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: 'space-around',
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingVertical: 32,
    backgroundColor: '#fff',
    rowGap: 16,
    flex: 1,
  },
  imageOuterContainer: {
    width: '45%',
    aspectRatio: 1,
  },
  imageInnerContainer: {
    borderRadius: 16,
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    overflow: 'hidden',
    paddingBottom: 8,
  },
  imageLabel: {
    color: '#fff',
    fontWeight: 700,
    fontSize: 16,
  },
})

export default PickImageFromCategory
