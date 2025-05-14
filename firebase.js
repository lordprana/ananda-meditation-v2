import { initializeApp } from 'firebase/app';
import { getRemoteConfig, fetchAndActivate, getValue } from 'firebase/remote-config';
import { Platform } from 'react-native'

// Your Firebase config object
const firebaseConfig = {
  apiKey: 'AIzaSyDwbeWuTqz_0f3NfFePH25zo24tZd7mhnk',
  authDomain: 'ananda-meditation.firebaseapp.com',
  projectId: 'ananda-meditation',
  storageBucket: 'ananda-meditation.appspot.com',
  appId: Platform.select({
    ios: '1:372284082503:ios:d770d6f7ca26a391',
    android: '1:372284082503:android:e24f563f8a33f27b'
  }),
};

// Initialize Firebase
console.log('initializing firebase')
const app = initializeApp(firebaseConfig);
console.log('initialized firebase')

// Initialize Remote Config
console.log('getting remote config')
const remoteConfig = getRemoteConfig(app);
console.log('got remote config')
console.log(remoteConfig)

// Optionally set default values
remoteConfig.defaultConfig = {
  welcome_message: 'Welcome to the app!',
};

export { remoteConfig, fetchAndActivate, getValue };
