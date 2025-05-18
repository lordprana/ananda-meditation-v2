// /store/favoriteMeditationsSlice.js
import { createSlice } from '@reduxjs/toolkit'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Constants from 'expo-constants'
import { selectCustomMeditationById } from '@/store/customMeditationsSlice'

const STORAGE_KEY = 'meditationLibraries'
const LIBRARY_KEYS = {
  meditation: 'Meditation',
  kriya: 'Kriya',
  custom: 'Custom',
  silent: 'Silent',
}

export const selectMeditationLibrary = (state) => state.meditationLibraries.find((library) => library.title === LIBRARY_KEYS.meditation).sections
export const selectKriyaLibrary = (state) => state.meditationLibraries.find((library) => library.title === LIBRARY_KEYS.kriya).sections

// This recursively searches the meditation libraries for an item with the supplied contentfulId
export const selectItemByContentfulId = (contentfulId) => state => {
  return selectLibraryItemByCallback(item => item.contentfulId === contentfulId)(state)
    || selectCustomMeditationById(contentfulId)(state)


}

export const selectLibraryItemByCallback = (callback) => state => {
  const searchTreeForItem = (tree) => {
    if (typeof tree !== 'object' || tree === null) return null

    // Check if this tree is the item we're looking for
    if (callback(tree)) {
      return tree
    }

    if (Array.isArray(tree)) {
      for (const item of tree) {
        const result = searchTreeForItem(item)
        if (result) return result // stop at the first match
      }
    } else {
      // Search all keys recursively
      for (const key in tree) {
        const value = tree[key]
        if (Array.isArray(value)) {
          for (const child of value) {
            const result = searchTreeForItem(child)
            if (result) return result // stop at the first match
          }
        }
      }
    }

    return null // No match found
  }
  return searchTreeForItem(state.meditationLibraries)
}

export const createCustomMeditationContentfulId = () => {
  return `custom-${Date.now()}`
}

// This is a nested file structure of the meditation libraries content as defined in contentful.
// The bottom of this file contains the contentful data structure for the meditation libraries.
// This is subject to change if the contentful data structure changes.
const meditationLibrariesSlice = createSlice({
  name: 'meditationLibraries',
  initialState: [], // array of meditation IDs
  reducers: {
    setMeditationLibraries: (state, action) => {
      return action.payload
    },
    addSilentMeditation: (state, action) => {
      const { title, thumbnailUrl, videoUrl, segments, contentfulId } = action.payload
      const customId = contentfulId || createCustomMeditationContentfulId()
      const newMeditation = {
        title,
        thumbnailUrl,
        videoUrl,
        segments,
        contentfulId: customId,
        contentfulContentType: 'meditation',
      }

      const silentLibrary = state.find((library) => library.title === LIBRARY_KEYS.silent)
      if (!silentLibrary) {
        state.push({
          title: LIBRARY_KEYS.silent,
          meditations: [newMeditation],
        })
      } else {
        silentLibrary.meditations = [...silentLibrary.meditations, newMeditation]
      }
    },
  },
})
const { setMeditationLibraries } = meditationLibrariesSlice.actions
export const { addSilentMeditation} = meditationLibrariesSlice.actions

// Makes an external API request
export const loadMeditationLibraries = (bypassLocalCache = true) => async (dispatch) => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY)
    if (data && !bypassLocalCache) {
      dispatch(setMeditationLibraries(JSON.parse(data)))
    } else {
      await dispatch(fetchMeditationLibraries())
    }
  } catch (e) {
    console.warn('Failed to load meditation libraries', e)
    throw e
  }
}

const fetchMeditationLibraries = () => async (dispatch) => {
  let data
  try {
    const response = await fetch(Constants.expoConfig.extra.CONTENTFUL_CACHE_SERVER_PATH)
    data = await response.json()
    dispatch(setMeditationLibraries(data))
  } catch (e) {
    console.warn('Failed to fetch meditation libraries', e)
    throw e
  }
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (e) {
    console.warn('Failed to save meditation libraries to storage')
  }
}


export const getMeditationDuration = (meditation) => {
  return meditation.segments.reduce((acc, segment) => {
    return acc + segment.duration
  }, 0)
}

export default meditationLibrariesSlice.reducer


/* SAMPLE CONTENTFUL RESPONSE
[
    {
        "title": "Meditation",
        "sections": [
            {
                "title": "Learn to Meditate",
                "item": [
                    {
                        "title": "How to Meditate",
                        "thumbnailUrl": "https://firebasestorage.googleapis.com/v0/b/ananda-meditation.appspot.com/o/a-simple-meditation-technique-2.jpg?alt=media&token=ff827963-fdf1-4cd7-8f7b-e2e6ba5b534c",
                        "videoUrl": "https://firebasestorage.googleapis.com/v0/b/ananda-meditation.appspot.com/o/a_simple_meditation_technique.mp4?alt=media&token=90fba681-9246-456c-8f29-f62ae6bca5d5",
                        "segments": [
                            {
                                "title": "A Simple Meditation Technique",
                                "duration": 789,
                                "audioUrl": "https://firebasestorage.googleapis.com/v0/b/ananda-meditation.appspot.com/o/a_simple_meditation_technique.mp3?alt=media&token=b95ac0b0-446d-478e-a2f4-21b115db3dce",
                                "category": "Talk",
                                "contentfulId": "52AXq2ZnEHC4speDv4sDpn",
                                "contentfulContentType": "meditationSegments"
                            }
                        ],
                        "category": "Talk",
                        "contentfulId": "B6nlqZHmw2NJi5KsLMb9l",
                        "contentfulContentType": "meditation"
                    },
                    {
                        "title": "How to Sit for Meditation",
                        "thumbnailUrl": "https://firebasestorage.googleapis.com/v0/b/ananda-meditation.appspot.com/o/how_to_sit_for_meditation_a_2.jpg?alt=media&token=65788944-2356-458c-9d57-c10784776ff6",
                        "videoUrl": "https://firebasestorage.googleapis.com/v0/b/ananda-meditation.appspot.com/o/how_to_sit_comfortably_for_meditation.mp4?alt=media&token=e07f2b70-d03b-45bd-ab30-3dc41a73521c",
                        "segments": [
                            {
                                "title": "How to Sit for Meditation",
                                "duration": 335,
                                "audioUrl": "https://firebasestorage.googleapis.com/v0/b/ananda-meditation.appspot.com/o/how_to_sit_comfortably_for_meditation.mp3?alt=media&token=ef154cbf-dd11-4ce0-bc4c-4f1fa713b4fb",
                                "category": "Talk",
                                "contentfulId": "1hYwzNgSCJT2CR6csCIYwF",
                                "contentfulContentType": "meditationSegments"
                            }
                        ],
                        "teacher": "Maria",
                        "category": "Talk",
                        "contentfulId": "4cAZReSzF0t9zP4orprAce",
                        "contentfulContentType": "meditation"
                    }
                ],
                "contentfulId": "5XX4JeCQXqVItbfxqXfxCh",
                "contentfulContentType": "section"
            },
            {
                "title": "Spiritual Practices",
                "item": [
                    {
                        "title": "Energy Tools",
                        "fontAwesomeIconName": "sun",
                        "meditations": [
                            {
                                "title": "How to Meditate",
                                "thumbnailUrl": "https://firebasestorage.googleapis.com/v0/b/ananda-meditation.appspot.com/o/a-simple-meditation-technique-2.jpg?alt=media&token=ff827963-fdf1-4cd7-8f7b-e2e6ba5b534c",
                                "videoUrl": "https://firebasestorage.googleapis.com/v0/b/ananda-meditation.appspot.com/o/a_simple_meditation_technique.mp4?alt=media&token=90fba681-9246-456c-8f29-f62ae6bca5d5",
                                "segments": [
                                    {
                                        "title": "A Simple Meditation Technique",
                                        "duration": 789,
                                        "audioUrl": "https://firebasestorage.googleapis.com/v0/b/ananda-meditation.appspot.com/o/a_simple_meditation_technique.mp3?alt=media&token=b95ac0b0-446d-478e-a2f4-21b115db3dce",
                                        "category": "Talk",
                                        "contentfulId": "52AXq2ZnEHC4speDv4sDpn",
                                        "contentfulContentType": "meditationSegments"
                                    }
                                ],
                                "category": "Talk",
                                "contentfulId": "B6nlqZHmw2NJi5KsLMb9l",
                                "contentfulContentType": "meditation"
                            }
                        ],
                        "contentfulId": "2ZtFbkxJRuffqygJnxy3UM",
                        "contentfulContentType": "meditationGroup"
                    }
                ],
                "contentfulId": "19QrmZgjBpNUfCyZdHP4bw",
                "contentfulContentType": "section"
            }
        ],
        "contentfulId": "7rUu0x3XHtyIvEERhfpX6n",
        "contentfulContentType": "library"
    },
    {
        "title": "Kriya",
        "contentfulId": "X6dTEEhmgaiaiT859In4j",
        "contentfulContentType": "library"
    }
]
 */


