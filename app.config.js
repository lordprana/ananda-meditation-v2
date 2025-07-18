import 'dotenv/config'

const requiredEnvVars = [
  'CONTENTFUL_CACHE_SERVER_PATH',
  'FIREBASE_CLOUD_AUTH_FUNCTION_PATH',
]

const config = {
  'name': 'Meditation',
  'slug': 'ananda-meditation-v2',
  'icon': './assets/images/icon.png',
  'scheme': 'anandameditationv2',
  'userInterfaceStyle': 'automatic',
  'newArchEnabled': false,
  'version': '3.0.0',
  'sdkVersion': '53.0.0',
  'assetBundlePatterns': ['assets/fonts/*', 'assets/images/*', 'assets/audio/*'],
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
      "ITSAppUsesNonExemptEncryption": false
    },
  },
  'android': {
    'edgeToEdgeEnabled': true,
    'googleServicesFile': './google-services.json',
    'package': 'kriyaban.ananda.org.anandameditation',
  },
  'plugins': [
    './plugins/with-target-device-family',
    'expo-router',
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
        'image': './assets/images/adaptive-icon.png',
        'imageWidth': 200,
        'resizeMode': 'contain',
        'backgroundColor': '#3388CC',
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
    'eas': {
      'projectId': '94268b94-4014-4cab-b496-ec235086f763',
    },
  },
}

console.log('Configuring app config with environment variables...')
requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    console.warn(`Warning: Missing required environment variable: ${key}. This may cause issues in production.`)
  }
  console.log(`${key}=${process.env[key]}`)
  config.extra[key] = process.env[key]
})

export default config
