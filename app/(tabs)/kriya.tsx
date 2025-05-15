import {Image} from 'expo-image';
import {Platform, StyleSheet} from 'react-native';

import {Collapsible} from '@/components/Collapsible';
import {ExternalLink} from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import {ThemedText} from '@/components/ThemedText';
import {ThemedView} from '@/components/ThemedView';
import {IconSymbol} from '@/components/ui/IconSymbol';
import KriyaNotSignedIn from "@/components/kriya/KriyaNotSignedIn";
import {useSelector} from "react-redux";
import {selectIsKriyaban} from "@/store/userSlice";
import MeditationLibrary from "@/components/meditations/MeditationLibrary";
import {selectKriyaLibrary, selectMeditationLibrary} from "@/store/meditationLibrariesSlice";

export default function KriyaScreen() {
    const isKriyaban = useSelector(selectIsKriyaban)
    //TODO: selectKriyaLibrary once we've added content
    // const kriyaLibraryContent = useSelector(selectKriyaLibrary)
    const kriyaLibraryContent = useSelector(selectMeditationLibrary)
    return <>
        {!isKriyaban && <KriyaNotSignedIn />}
        {isKriyaban && <MeditationLibrary
          content={kriyaLibraryContent}
          showDonateButton={false}
        />}
    </>
}

const styles = StyleSheet.create({
    headerImage: {
        color: '#808080',
        bottom: -90,
        left: -35,
        position: 'absolute',
    },
    titleContainer: {
        flexDirection: 'row',
        gap: 8,
    },
});
