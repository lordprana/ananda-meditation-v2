import 'dotenv/config'

const config = {
  'name': 'ananda-meditation-v2',
  'slug': 'ananda-meditation-v2',
  'version': '1.0.0',
  'sdkVersion': '53.0.0',
  'platforms': [
    'ios',
    'android',
  ],
  'ios': {
    'bundleIdentifier': 'com.mukti.devclient',
  },
  'extra': {
    'CONTENTFUL_CACHE_SERVER_PATH': process.env.CONTENTFUL_CACHE_SERVER_PATH,
    'eas': {
      'projectId': '94268b94-4014-4cab-b496-ec235086f763',
    },
  },
}

export default config
