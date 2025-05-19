import * as React from 'react'
import { Text, View } from 'react-native'
import { Colors } from '../../constants/Colors'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import ConfigureSilentSegment from './ConfigureSilentSegment'
import { useDispatch } from 'react-redux'
import { addCustomMeditation, addCustomMeditationSegment } from '../../store/customMeditationsSlice'
import PickSegmentFromCategory from './PickSegmentFromCategory'

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
  const addMeditationSegment = (segment) => {
    dispatch(addCustomMeditationSegment({
      id: customMeditationId,
      segment,
    }))
  }
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
        {() => <ConfigureSilentSegment addMeditationSegment={addMeditationSegment} />}
      </Tab.Screen>
      <Tab.Screen name={'Affirm'}>
        {() => <PickSegmentFromCategory addMeditationSegment={addMeditationSegment} category={'Affirm'} />}
      </Tab.Screen>
      <Tab.Screen name={'Bell'}>
        {() => <PickSegmentFromCategory addMeditationSegment={addMeditationSegment} category={'Bell'} />}
      </Tab.Screen>
      <Tab.Screen name={'Chant'}>
        {() => <PickSegmentFromCategory addMeditationSegment={addMeditationSegment} category={'Chant'} />}
      </Tab.Screen>
      <Tab.Screen name={'Pray'}>
        {() => <PickSegmentFromCategory addMeditationSegment={addMeditationSegment} category={'Pray'} />}
      </Tab.Screen>
      <Tab.Screen name={'Talk'}>
        {() => <PickSegmentFromCategory addMeditationSegment={addMeditationSegment} category={'Talk'} />}
      </Tab.Screen>
    </Tab.Navigator>
  )
}


export default PickCustomMeditationTrack
