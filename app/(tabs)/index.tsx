import {StyleSheet} from 'react-native';
import React from "react";
import MeditationLibrary from "@/components/meditations/MeditationLibrary";
import {useSelector} from "react-redux";
import {selectMeditationLibrary} from "@/store/meditationLibrariesSlice";

export default function MeditationScreen() {
    const meditationLibraryContent = useSelector(selectMeditationLibrary)
    console.log(meditationLibraryContent)
    return (
        <MeditationLibrary
            content={meditationLibraryContent}
            // content={[
            //     {
            //         sectionTitle: 'Learn to Meditate',
            //         type: 'videos',
            //         videos: [
            //             {
            //                 title: 'How to Meditate',
            //                 duration: '13:09',
            //                 thumbnailUrl: 'https://firebasestorage.googleapis.com/v0/b/ananda-meditation.appspot.com/o/kirtan_a_2.jpg?alt=media&token=1be68609-de42-4db6-a53a-6c1c15e2a336',
            //                 videoUrl: 'https://firebasestorage.googleapis.com/v0/b/ananda-meditation.appspot.com/o/energization_exercises_gyandev_part4_v3.mp4?alt=media&token=a6354931-fb2b-463b-b9bc-b0f4ef489c80',
            //             },
            //             {
            //                 title: 'How to Meditate',
            //                 duration: '13:09',
            //                 thumbnailUrl: 'https://firebasestorage.googleapis.com/v0/b/ananda-meditation.appspot.com/o/kirtan_a_2.jpg?alt=media&token=1be68609-de42-4db6-a53a-6c1c15e2a336',
            //                 videoUrl: 'https://example.com/video1.mp4',
            //             },
            //         ]
            //     },
            //     {
            //         sectionTitle: 'Guided Meditation',
            //         type: 'videos',
            //         videos: [
            //             {
            //                 title: 'How to Meditate',
            //                 duration: '13:09',
            //                 thumbnailUrl: 'https://firebasestorage.googleapis.com/v0/b/ananda-meditation.appspot.com/o/kirtan_a_2.jpg?alt=media&token=1be68609-de42-4db6-a53a-6c1c15e2a336',
            //                 videoUrl: 'https://example.com/video1.mp4',
            //             },
            //             {
            //                 title: 'How to Meditate',
            //                 duration: '13:09',
            //                 thumbnailUrl: 'https://firebasestorage.googleapis.com/v0/b/ananda-meditation.appspot.com/o/kirtan_a_2.jpg?alt=media&token=1be68609-de42-4db6-a53a-6c1c15e2a336',
            //                 videoUrl: 'https://example.com/video1.mp4',
            //             },
            //         ]
            //     },
            //     {
            //         sectionTitle: 'Silent Timer',
            //         type: 'timers',
            //     },
            //     {
            //         sectionTitle: 'Spiritual Practices',
            //         type: 'groups',
            //         groups: [
            //             {
            //                 groupName: 'Energy Tools',
            //                 fontAwesomeIconCode: 'sun',
            //                 videos: [
            //                     {
            //                         title: 'How to Meditate',
            //                         duration: '13:09',
            //                         thumbnailUrl: 'https://example.com/thumbnail1.jpg',
            //                         videoUrl: 'https://example.com/video1.mp4',
            //                     },
            //                     {
            //                         title: 'How to Meditate',
            //                         duration: '13:09',
            //                         thumbnailUrl: 'https://example.com/thumbnail1.jpg',
            //                         videoUrl: 'https://example.com/video1.mp4',
            //                     },
            //                 ]
            //             },
            //             {
            //                 groupName: 'Guided Affirmations',
            //                 fontAwesomeIconCode: 'sun',
            //                 videos: [
            //                     {
            //                         title: 'How to Meditate',
            //                         duration: '13:09',
            //                         thumbnailUrl: 'https://example.com/thumbnail1.jpg',
            //                         videoUrl: 'https://example.com/video1.mp4',
            //                     },
            //                     {
            //                         title: 'How to Meditate',
            //                         duration: '13:09',
            //                         thumbnailUrl: 'https://example.com/thumbnail1.jpg',
            //                         videoUrl: 'https://example.com/video1.mp4',
            //                     },
            //                 ]
            //             },
            //         ]
            //     },
            //     {
            //         sectionTitle: 'Others',
            //         type: 'groups',
            //         groups: [
            //             {
            //                 groupName: 'How to Know and Trust Inner Guidance',
            //                 fontAwesomeIconCode: 'sun',
            //                 videos: [
            //                     {
            //                         title: 'How to Meditate',
            //                         duration: '13:09',
            //                         thumbnailUrl: 'https://example.com/thumbnail1.jpg',
            //                         videoUrl: 'https://example.com/video1.mp4',
            //                     },
            //                     {
            //                         title: 'How to Meditate',
            //                         duration: '13:09',
            //                         thumbnailUrl: 'https://example.com/thumbnail1.jpg',
            //                         videoUrl: 'https://example.com/video1.mp4',
            //                     },
            //                 ]
            //             },
            //             {
            //                 groupName: 'Metaphysical Meditations',
            //                 fontAwesomeIconCode: 'sun',
            //                 videos: [
            //                     {
            //                         title: 'How to Meditate',
            //                         duration: '13:09',
            //                         thumbnailUrl: 'https://example.com/thumbnail1.jpg',
            //                         videoUrl: 'https://example.com/video1.mp4',
            //                     },
            //                     {
            //                         title: 'How to Meditate',
            //                         duration: '13:09',
            //                         thumbnailUrl: 'https://example.com/thumbnail1.jpg',
            //                         videoUrl: 'https://example.com/video1.mp4',
            //                     },
            //                 ]
            //             },
            //         ]
            //     },
            //     {
            //         sectionTitle: 'Ananda School of Yoga and Meditation',
            //         type: 'videos',
            //         videos: [
            //             {
            //                 title: 'How to Meditate',
            //                 duration: '13:09',
            //                 thumbnailUrl: 'https://example.com/thumbnail1.jpg',
            //                 videoUrl: 'https://example.com/video1.mp4',
            //             },
            //             {
            //                 title: 'How to Meditate',
            //                 duration: '13:09',
            //                 thumbnailUrl: 'https://example.com/thumbnail1.jpg',
            //                 videoUrl: 'https://example.com/video1.mp4',
            //             },
            //         ]
            //     },
            //     {
            //         sectionTitle: 'Energization Exercises and Pranayama',
            //         type: 'videos',
            //         videos: [
            //             {
            //                 title: 'How to Meditate',
            //                 duration: '13:09',
            //                 thumbnailUrl: 'https://example.com/thumbnail1.jpg',
            //                 videoUrl: 'https://example.com/video1.mp4',
            //             },
            //             {
            //                 title: 'How to Meditate',
            //                 duration: '13:09',
            //                 thumbnailUrl: 'https://example.com/thumbnail1.jpg',
            //                 videoUrl: 'https://example.com/video1.mp4',
            //             },
            //         ]
            //     },
            //     {
            //         sectionTitle: 'Short Meditations',
            //         type: 'videos',
            //         videos: [
            //             {
            //                 title: 'How to Meditate',
            //                 duration: '13:09',
            //                 thumbnailUrl: 'https://example.com/thumbnail1.jpg',
            //                 videoUrl: 'https://example.com/video1.mp4',
            //             },
            //             {
            //                 title: 'How to Meditate',
            //                 duration: '13:09',
            //                 thumbnailUrl: 'https://example.com/thumbnail1.jpg',
            //                 videoUrl: 'https://example.com/video1.mp4',
            //             },
            //         ]
            //     },
            // ]}
            showDonateButton={true}
        />
    )
}
