import TrackPlayer from 'react-native-track-player';

// This brings in your Expo Router navigation
import 'expo-router/entry';

// Register your Track Player background service
TrackPlayer.registerPlaybackService(() => require('./trackPlayerService'));
