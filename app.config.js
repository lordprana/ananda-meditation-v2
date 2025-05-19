import 'dotenv/config'

const config = {
  'name': 'ananda-meditation-v2',
  'slug': 'ananda-meditation-v2',
  'icon': './assets/images/icon.png',
  'scheme': 'anandameditationv2',
  'userInterfaceStyle': 'automatic',
  'newArchEnabled': true,
  'version': '1.0.0',
  'sdkVersion': '53.0.0',
  'platforms': [
    'ios',
    'android',
  ],
  'ios': {
    'bundleIdentifier': 'org.ananda.kriyaban',
    'supportTablet': true,
    'googleServicesFile': './GoogleService-Info.plist',
    'infoPlist': {
      'UIBackgroundModes': [
        'audio',
      ],
    },
  },
  'android': {
    'adaptiveIcon': {
      'foregroundImage': './assets/images/adaptive-icon.png',
      'backgroundColor': '#ffffff',
    },
    'edgeToEdgeEnabled': true,
    'googleServicesFile': './google-services.json',
    'package': 'kriyaban.ananda.org.anandameditation',
  },
  'plugins': [
    'expo-router',
    'react-native-reanimated/plugin',
    '@react-native-firebase/app',
    '@react-native-firebase/auth',
    [
      'expo-build-properties',
      {
        'ios': {
          'useFrameworks': 'static',
        },
      },
    ],
    [
      'expo-splash-screen',
      {
        'image': './assets/images/splash-icon.png',
        'imageWidth': 200,
        'resizeMode': 'contain',
        'backgroundColor': '#ffffff',
      },
    ],
    [
      'expo-video',
      {
        'supportsBackgroundPlayback': true,
        'supportsPictureInPicture': true,
      },
    ],
  ],
  'experiments': {
    'typedRoutes': true,
  },
  'extra': {
    'CONTENTFUL_CACHE_SERVER_PATH': process.env.CONTENTFUL_CACHE_SERVER_PATH,
     'FIREBASE_CLOUD_AUTH_FUNCTION_PATH': process.env.FIREBASE_CLOUD_AUTH_FUNCTION_PATH,
    'eas': {
      'projectId': '94268b94-4014-4cab-b496-ec235086f763',
    },
  },
}

export default config
