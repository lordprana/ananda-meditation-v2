import {Tabs} from 'expo-router';
import React from 'react';
import {Platform, StyleSheet} from 'react-native';

import {HapticTab} from '@/components/HapticTab';
import {IconSymbol} from '@/components/ui/IconSymbol';
import {useColorScheme} from '@/hooks/useColorScheme';
import {Image} from "expo-image";
import {Colors} from "@/constants/Colors";
import FontAwesomeIcon from "@expo/vector-icons/FontAwesome6"
import FontAwesomeIcon5 from "@expo/vector-icons/FontAwesome5"

export default function TabLayout() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light']

    const getTabBarStyle = (backgroundColor) => Platform.select({
        default: {
            position: 'absolute',
            height: 80,
            paddingTop: 4,
            paddingHorizontal: 6,
            backgroundColor
        }
    })
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#fff',
                tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.5)',
                headerShown: false,
                tabBarButton: HapticTab,
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Meditation',
                    tabBarIcon: ({focused}) =>
                        <Image
                            style={[{
                                width: undefined,
                                height: iconSize,
                                aspectRatio: 336/384,
                            }, !focused && {opacity: 0.5}]}
                            source={require('@/assets/images/tab-bar-icons/lotus-icon.png')}
                          />,
                    tabBarStyle: getTabBarStyle(colors.lightestBlue),
                }}
            />
            <Tabs.Screen
                name="explore"
                options={{
                    title: 'My Things',
                    tabBarIcon: ({color}) =>
                        <FontAwesomeIcon
                            size={iconSize}
                            name="user"
                            color={color}
                        />,
                    tabBarStyle: getTabBarStyle(colors.electricBlue)
                }}
            />
            <Tabs.Screen
                name= "explore1"
                options={{
                    title: 'Kriya',
                    tabBarIcon: ({focused}) =>
                        <Image
                            style={[styles.tabIcon, !focused && {opacity: 0.5}]}
                            source={require('@/assets/images/tab-bar-icons/rose-small.png')}
                        />,
                    tabBarStyle: getTabBarStyle(colors.goldenYellow),
                }}
            />
            <Tabs.Screen
                name="explore2"
                options={{
                    title: 'Statistics',
                    tabBarIcon: ({color}) =>
                        <FontAwesomeIcon
                            size={iconSize}
                            name="bar-chart"
                            color={color}
                        />,
                    tabBarStyle: getTabBarStyle(colors.electricBlue)
                }}
            />
            <Tabs.Screen
                name="explore3"
                options={{
                    title: 'Info',
                    tabBarIcon: ({color}) =>
                        <FontAwesomeIcon5
                            size={iconSize}
                            name="info-circle"
                            color={color}
                        />,
                    tabBarStyle: getTabBarStyle(colors.lightestBlue)
                }}
            />
        </Tabs>
    );
}

const iconSize = 24
const styles = StyleSheet.create({
    tabIcon: {
        width: iconSize,
        height: iconSize,
    }
})
