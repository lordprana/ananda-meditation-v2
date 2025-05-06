import {Image} from 'expo-image';
import {Platform, StyleSheet} from 'react-native';

import {HelloWave} from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import {ThemedText} from '@/components/ThemedText';
import {ThemedView} from '@/components/ThemedView';
import React from "react";
import MeditationLibrary from "@/components/meditations/MeditationLibrary";

export default function MeditationScreen() {
    return (
        <MeditationLibrary
            content={[
                {
                    sectionTitle: 'Learn to Meditate',
                    type: 'videos',
                    videos: [
                        {
                            title: 'How to Meditate',
                            duration: '13:09',
                            thumbnailUrl: 'https://firebasestorage.googleapis.com/v0/b/ananda-meditation.appspot.com/o/kirtan_a_2.jpg?alt=media&token=1be68609-de42-4db6-a53a-6c1c15e2a336',
                            videoUrl: 'https://example.com/video1.mp4',
                        },
                        {
                            title: 'How to Meditate',
                            duration: '13:09',
                            thumbnailUrl: 'https://firebasestorage.googleapis.com/v0/b/ananda-meditation.appspot.com/o/kirtan_a_2.jpg?alt=media&token=1be68609-de42-4db6-a53a-6c1c15e2a336',
                            videoUrl: 'https://example.com/video1.mp4',
                        },
                    ]
                },
                {
                    sectionTitle: 'Guided Meditation',
                    type: 'videos',
                    videos: [
                        {
                            title: 'How to Meditate',
                            duration: '13:09',
                            thumbnailUrl: 'https://firebasestorage.googleapis.com/v0/b/ananda-meditation.appspot.com/o/kirtan_a_2.jpg?alt=media&token=1be68609-de42-4db6-a53a-6c1c15e2a336',
                            videoUrl: 'https://example.com/video1.mp4',
                        },
                        {
                            title: 'How to Meditate',
                            duration: '13:09',
                            thumbnailUrl: 'https://firebasestorage.googleapis.com/v0/b/ananda-meditation.appspot.com/o/kirtan_a_2.jpg?alt=media&token=1be68609-de42-4db6-a53a-6c1c15e2a336',
                            videoUrl: 'https://example.com/video1.mp4',
                        },
                    ]
                },
            //     {
            //         sectionTitle: 'Silent Timer',
            //         type: 'timers',
            //     },
                {
                    sectionTitle: 'Spiritual Practices',
                    type: 'groups',
                    groups: [
                        {
                            groupName: 'Energy Tools',
                            fontAwesomeIconCode: 'sun',
                            videos: [
                                {
                                    title: 'How to Meditate',
                                    duration: '13:09',
                                    thumbnailUrl: 'https://example.com/thumbnail1.jpg',
                                    videoUrl: 'https://example.com/video1.mp4',
                                },
                                {
                                    title: 'How to Meditate',
                                    duration: '13:09',
                                    thumbnailUrl: 'https://example.com/thumbnail1.jpg',
                                    videoUrl: 'https://example.com/video1.mp4',
                                },
                            ]
                        },
                        {
                            groupName: 'Guided Affirmations',
                            fontAwesomeIconCode: 'sun',
                            videos: [
                                {
                                    title: 'How to Meditate',
                                    duration: '13:09',
                                    thumbnailUrl: 'https://example.com/thumbnail1.jpg',
                                    videoUrl: 'https://example.com/video1.mp4',
                                },
                                {
                                    title: 'How to Meditate',
                                    duration: '13:09',
                                    thumbnailUrl: 'https://example.com/thumbnail1.jpg',
                                    videoUrl: 'https://example.com/video1.mp4',
                                },
                            ]
                        },
                    ]
                },
                {
                    sectionTitle: 'Others',
                    type: 'groups',
                    groups: [
                        {
                            groupName: 'How to Know and Trust Inner Guidance',
                            fontAwesomeIconCode: 'sun',
                            videos: [
                                {
                                    title: 'How to Meditate',
                                    duration: '13:09',
                                    thumbnailUrl: 'https://example.com/thumbnail1.jpg',
                                    videoUrl: 'https://example.com/video1.mp4',
                                },
                                {
                                    title: 'How to Meditate',
                                    duration: '13:09',
                                    thumbnailUrl: 'https://example.com/thumbnail1.jpg',
                                    videoUrl: 'https://example.com/video1.mp4',
                                },
                            ]
                        },
                        {
                            groupName: 'Metaphysical Meditations',
                            fontAwesomeIconCode: 'sun',
                            videos: [
                                {
                                    title: 'How to Meditate',
                                    duration: '13:09',
                                    thumbnailUrl: 'https://example.com/thumbnail1.jpg',
                                    videoUrl: 'https://example.com/video1.mp4',
                                },
                                {
                                    title: 'How to Meditate',
                                    duration: '13:09',
                                    thumbnailUrl: 'https://example.com/thumbnail1.jpg',
                                    videoUrl: 'https://example.com/video1.mp4',
                                },
                            ]
                        },
                    ]
                },
                {
                    sectionTitle: 'Ananda School of Yoga and Meditation',
                    type: 'videos',
                    videos: [
                        {
                            title: 'How to Meditate',
                            duration: '13:09',
                            thumbnailUrl: 'https://example.com/thumbnail1.jpg',
                            videoUrl: 'https://example.com/video1.mp4',
                        },
                        {
                            title: 'How to Meditate',
                            duration: '13:09',
                            thumbnailUrl: 'https://example.com/thumbnail1.jpg',
                            videoUrl: 'https://example.com/video1.mp4',
                        },
                    ]
                },
                {
                    sectionTitle: 'Energization Exercises and Pranayama',
                    type: 'videos',
                    videos: [
                        {
                            title: 'How to Meditate',
                            duration: '13:09',
                            thumbnailUrl: 'https://example.com/thumbnail1.jpg',
                            videoUrl: 'https://example.com/video1.mp4',
                        },
                        {
                            title: 'How to Meditate',
                            duration: '13:09',
                            thumbnailUrl: 'https://example.com/thumbnail1.jpg',
                            videoUrl: 'https://example.com/video1.mp4',
                        },
                    ]
                },
                {
                    sectionTitle: 'Short Meditations',
                    type: 'videos',
                    videos: [
                        {
                            title: 'How to Meditate',
                            duration: '13:09',
                            thumbnailUrl: 'https://example.com/thumbnail1.jpg',
                            videoUrl: 'https://example.com/video1.mp4',
                        },
                        {
                            title: 'How to Meditate',
                            duration: '13:09',
                            thumbnailUrl: 'https://example.com/thumbnail1.jpg',
                            videoUrl: 'https://example.com/video1.mp4',
                        },
                    ]
                },
            ]}
            showDonateButton={true}
        />
    )
}

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    stepContainer: {
        gap: 8,
        marginBottom: 8,
    },
    reactLogo: {
        height: 178,
        width: 290,
        bottom: 0,
        left: 0,
        position: 'absolute',
    },
});
