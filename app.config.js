import 'dotenv/config';

export default ({ config }) => ({
  ...config,
  extra: {
    CONTENTFUL_CACHE_SERVER_PATH: process.env.CONTENTFUL_CACHE_SERVER_PATH,
  },
});
