import * as React from 'react'
import { Text, View } from 'react-native'
import { Colors } from '../../constants/Colors'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import ConfigureSilentSegment from './ConfigureSilentSegment'
import { useDispatch } from 'react-redux'
import { addCustomMeditation, addCustomMeditationSegment } from '../../store/customMeditationsSlice'
import PickSegmentFromCategory from './PickSegmentFromCategory'
import { useRouter } from 'expo-router'

const FirstRoute = () => (
  <View style={{ flex: 1, backgroundColor: '#ff4081' }} />
)

const SecondRoute = () => (
  <View style={{ flex: 1, backgroundColor: '#673ab7' }} />
)

const SilentMeditationScreen = () => {
  return (
    <View style={{ flex: 1, backgroundColor: '#ff4081' }} />
  )
}

const SegmentList = ({ category }) => {
  return (
    <View style={{ flex: 1, backgroundColor: '#ff4091' }}>
      <Text>
        {category}
      </Text>
    </View>
  )
}

const Tab = createMaterialTopTabNavigator()

const PickCustomMeditationTrack = ({ customMeditationId }) => {
  const dispatch = useDispatch()
  const router = useRouter()
  const addMeditationSegment = (segment) => {
    dispatch(addCustomMeditationSegment({
      id: customMeditationId,
      segment,
    }))
    router.dismissTo(`create-custom-meditation/${customMeditationId}`)
  }
  const meditationCategories = [
    'Affirm',
    'Bell',
    'Chant',
    'Pray',
    'Talk',
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
      <Tab.Screen name={'Silent'}>
        {() =>
          <ConfigureSilentSegment
            addMeditationSegment={addMeditationSegment}
          />}
      </Tab.Screen>
      {meditationCategories.map((category) => (
        <Tab.Screen name={category} key={category}>
          {() =>
            <PickSegmentFromCategory
              addMeditationSegment={addMeditationSegment}
              category={category}
            />}
        </Tab.Screen>
      ))}
    </Tab.Navigator>
  )
}


export default PickCustomMeditationTrack
