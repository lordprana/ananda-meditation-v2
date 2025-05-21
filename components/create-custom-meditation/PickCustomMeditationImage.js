import * as React from 'react'
import { Colors } from '../../constants/Colors'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import ConfigureSilentSegment from './ConfigureSilentSegment'
import { useDispatch } from 'react-redux'
import {
  addCustomMeditationSegmentForEditing,
  updateCustomMeditationImageForEditing,
} from '../../store/customMeditationsSlice'
import PickSegmentFromCategory from './PickSegmentFromCategory'
import { useRouter } from 'expo-router'
import PickImageFromCategory from './PickImageFromCategory'

const Tab = createMaterialTopTabNavigator()

const PickCustomMeditationTrack = ({ customMeditationId }) => {
  const dispatch = useDispatch()
  const router = useRouter()
  const updateImage = (image) => {
    dispatch(updateCustomMeditationImageForEditing({
      id: customMeditationId,
      image,
    }))
    router.dismissTo(`create-custom-meditation/${customMeditationId}`)
  }
  const imageCategories = [
    'Art',
    'Nature',
    'Masters',
    'Altar',
    'Other'
  ]
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarIndicatorStyle: {
          backgroundColor: Colors.light.lightestBlue,
        },
        tabBarLabelStyle: {
          fontSize: 13,
        },
      }}
    >
      {imageCategories.map((category) => (
        <Tab.Screen name={category} key={category}>
          {() =>
            <PickImageFromCategory
              updateImage={updateImage}
              category={category}
            />}
        </Tab.Screen>
      ))}
    </Tab.Navigator>
  )
}


export default PickCustomMeditationTrack
