import {DarkTheme, DefaultTheme, ThemeProvider} from '@react-navigation/native';
import {useFonts} from 'expo-font';
import {Stack} from 'expo-router';
import {StatusBar} from 'expo-status-bar';
import 'react-native-reanimated';

import {useColorScheme} from '@/hooks/useColorScheme';
import {useEffect, useState} from "react";
import {loadDataFromLocalStorage, store} from "@/store/store";
import {Provider} from "react-redux";
import {Colors} from "@/constants/Colors";

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const [loadedFonts] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
        Barkentina: require('../assets/fonts/Barkentina.ttf'),
    });
    const [loadedData, setLoadedData] = useState(false)

    useEffect(() => {
        store.dispatch(loadDataFromLocalStorage()).finally(() => {
            setLoadedData(true)
        })
    }, [])

    if (!loadedFonts || !loadedData) {
        return null;
    }

    return (
        <Provider store={store}>
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <Stack>
                    <Stack.Screen name="(tabs)" options={{headerShown: false}} />
                    <Stack.Screen
                        name={'meditation-group/[groupName]'}
                        options={{
                            headerStyle: {
                                backgroundColor: '#fff',
                            },
                            headerTintColor: '#000',
                            headerTitleStyle: {
                                fontFamily: 'Barkentina',
                                fontSize: 22,
                                color: Colors.light.lightestBlue
                            },
                            headerShadowVisible: false,
                            headerBackButtonDisplayMode: 'minimal',
                            headerTitleAlign: 'left',
                        }}
                    />
                    <Stack.Screen name="+not-found" />
                </Stack>
                <StatusBar style="auto" />
            </ThemeProvider>
        </Provider>
    );
}
