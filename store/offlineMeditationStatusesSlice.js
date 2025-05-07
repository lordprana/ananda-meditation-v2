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
      const id = action.payload
      const index = state.findIndex((item) => item.meditationId === id)
      if (index === -1) {
        state.push({
          meditationId: id,
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


export const toggleOfflineMeditationAsync = (id) => async (dispatch, getState) => {
  dispatch(toggleOfflineMeditation(id))
  try {
    const updated = getState().offlineMeditationStatuses
    console.log(updated)
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    const status = updated.find((item) => item.meditationId === id)?.downloadStatus
    // Meditation was just added as offline meditation
    if (status === 'pending') {
      try {
        await downloadVideo(id)
        dispatch(completeOfflineMeditationDownload(id))
      } catch (e) {
        console.lot(e)
        console.warn('Error downloading offline meditation')
        dispatch(toggleOfflineMeditation(id)) // Rollback
      }
      const updated = getState().offlineMeditationStatuses
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    } else if (!status) { // Meditation was just deleted
      try {
        await deleteVideo(id)
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

const VIDEO_DIR = FileSystem.documentDirectory + 'videos/'
const getSafeFilename = async (videoUrl) => {
  const hash = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    videoUrl,
  )
  return `${hash}.mp4` // or whatever extension you're using
}

const downloadVideo = async (videoUrl) => {
  const safeFilename = await getSafeFilename(videoUrl)
  const fileUri = VIDEO_DIR + safeFilename

  // Make sure the directory exists
  const dirInfo = await FileSystem.getInfoAsync(VIDEO_DIR)
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(VIDEO_DIR, { intermediates: true })
  }

  const fileInfo = await FileSystem.getInfoAsync(fileUri)
  if (!fileInfo.exists) {
    console.log('Downloading video...')
    await FileSystem.downloadAsync(videoUrl, fileUri)
  } else {
    console.log('Video already downloaded.')
  }

  return fileUri // Use this with your video player
}

const deleteVideo = async (videoUrl) => {
  const safeFilename = await getSafeFilename(videoUrl)
  const fileUri = VIDEO_DIR + safeFilename
  await FileSystem.deleteAsync(fileUri)
}

export default offlineMeditationStatusesSlice.reducer




