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
    'bundleIdentifier': 'com.mukti.devclient',
    'supportTablet': true,
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
  },
  'plugins': [
    'expo-router',
    [
      'expo-splash-screen',
      {
        'image': './assets/images/splash-icon.png',
        'imageWidth': 200,
        'resizeMode': 'contain',
        'backgroundColor': '#ffffff',
      },
    ],
  ],
  'experiments': {
    'typedRoutes': true,
  },
  'extra': {
    'CONTENTFUL_CACHE_SERVER_PATH': process.env.CONTENTFUL_CACHE_SERVER_PATH,
    'eas': {
      'projectId': '94268b94-4014-4cab-b496-ec235086f763',
    },
  },
}

export default config
