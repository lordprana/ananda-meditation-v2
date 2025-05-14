import {StyleSheet} from 'react-native';
import React from "react";
import MeditationLibrary from "@/components/meditations/MeditationLibrary";
import {useSelector} from "react-redux";
import {selectMeditationLibrary} from "@/store/meditationLibrariesSlice";

export default function MeditationScreen() {
    const meditationLibraryContent = useSelector(selectMeditationLibrary)
    return (
        <MeditationLibrary
            content={meditationLibraryContent}
            showDonateButton={true}
        />
    )
}
