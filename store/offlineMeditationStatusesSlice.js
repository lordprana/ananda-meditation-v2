// /store/favoriteMeditationsSlice.js
import { createSlice } from '@reduxjs/toolkit'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Crypto from 'expo-crypto'
import * as FileSystem from 'expo-file-system'

const STORAGE_KEY = 'offlineMeditationStatuses'

// Possible statuses are 'completed', 'pending', and 'readyToDownload'
export const selectOfflineMeditationStatus = (id) => (state) => {
  const status = state.offlineMeditationStatuses.find((item) => item.meditationId === id)
  return status?.downloadStatus || 'readyToDownload'
}

const offlineMeditationStatusesSlice = createSlice({
  name: 'offlineMeditationStatuses',
  initialState: [], // array of objects
  /*
   [
     {
        meditationId: '123',
        downloadStatus: 'completed', // or 'pending'
     }
   ]
   */
  reducers: {
    toggleOfflineMeditation: (state, action) => {
      const meditation = action.payload
      const index = state.findIndex((item) => item.meditationId === meditation.contentfulId)
      if (index === -1) {
        state.push({
          meditationId: meditation.contentfulId,
          meditation,
          downloadStatus: 'pending',
        })
      } else {
        state.splice(index, 1)
      }
    },
    completeOfflineMeditationDownload: (state, action) => {
      const id = action.payload
      const index = state.findIndex((item) => item.meditationId === id)
      state[index].downloadStatus = 'completed'
    },
    setOfflineMeditationStatuses: (state, action) => {
      return action.payload
    },
  },
})
const {
  toggleOfflineMeditation,
  setOfflineMeditationStatuses,
  completeOfflineMeditationDownload,
} = offlineMeditationStatusesSlice.actions


export const toggleOfflineMeditationAsync = (meditation) => async (dispatch, getState) => {
  dispatch(toggleOfflineMeditation(meditation))
  try {
    const updated = getState().offlineMeditationStatuses
    console.log(updated)
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    const status = updated.find((item) => item.meditationId === meditation.contentfulId)?.downloadStatus
    // Meditation was just added as offline meditation
    if (status === 'pending') {
      try {
        // We download all the media associated with the mediation: audio, video, and thumbnail
        await Promise.all([
          downloadMedia(meditation.videoUrl, meditation.contentfulId, 'video'),
          downloadMedia(meditation.thumbnailUrl, meditation.contentfulId, 'thumbnail'),
          ...meditation.segments.map((segment) => downloadMedia(segment.audioUrl, meditation.contentfulId, 'audio'))
        ])
        dispatch(completeOfflineMeditationDownload(meditation.contentfulId))
      } catch (e) {
        console.lot(e)
        console.warn('Error downloading offline meditation')
        dispatch(toggleOfflineMeditation(meditation)) // Rollback
      }
      const updated = getState().offlineMeditationStatuses
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    } else if (!status) { // Meditation was just deleted
      try {
        await Promise.all([
          deleteMedia(meditation.videoUrl, meditation.contentfulId, 'video'),
          deleteMedia(meditation.thumbnailUrl, meditation.contentfulId, 'thumbnail'),
          ...meditation.segments.map((segment) => deleteMedia(segment.audioUrl, meditation.contentfulId, 'audio'))
        ])
      } catch (e) {
        console.warn('Error deleting offline meditation')
      }
    }
  } catch (e) {
    console.warn('Failed to persist favorite changes', e)
  }
}

export const loadOfflineMeditationStatusesFromStorage = () => async (dispatch) => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY)
    if (data) {
      dispatch(setOfflineMeditationStatuses(JSON.parse(data)))
    }
  } catch (e) {
    console.warn('Failed to load favorites from storage', e)
  }
}

// The below code is responsible for downloading the video file
// and saving it to the file system

const APP_DIR = FileSystem.documentDirectory

// Convert the video URL to a safe filename (length + safe characters)
export const getSafeFileUri = async (mediaUrl, meditationId, mediaType = 'video') => {
  const hash = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    mediaUrl,
  )
  const extensionMap = {
    video: '.mp4',
    audio: '.mp3',
    thumbnail: '.jpg'
  }
  return `${APP_DIR}${meditationId}/${mediaType}/${hash}${extensionMap[mediaType]}`
}

const downloadMedia = async (mediaUrl, meditationId, mediaType = 'video') => {
  // Make sure the directory exists
  const directory = `${APP_DIR}${meditationId}/${mediaType}/`
  const dirInfo = await FileSystem.getInfoAsync(directory)
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(directory, { intermediates: true })
  }


  const fileUri = await getSafeFileUri(mediaUrl, meditationId, mediaType)
  const fileInfo = await FileSystem.getInfoAsync(fileUri)
  if (!fileInfo.exists) {
    console.log('Downloading media...')
    await FileSystem.downloadAsync(mediaUrl, fileUri)
    console.log('Media downloaded to:', fileUri)
  } else {
    console.log('Media already downloaded.')
  }

  return fileUri // Use this with your video player
}

const deleteMedia = async (mediaUrl, meditationId, mediaType='video') => {
  const safeUri = await getSafeFileUri(mediaUrl, meditationId, mediaType)
  await FileSystem.deleteAsync(safeUri)
}

export default offlineMeditationStatusesSlice.reducer




