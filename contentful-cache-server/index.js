import * as contentful from 'contentful'
import express from 'express'
import dotenv from 'dotenv'
import compression from 'compression'

dotenv.config()

const app = express()
app.use(compression({ level: 6, threshold: 0 }))

const port = process.env.PORT || 3000

let cache = null
let lastFetched = 0
const CACHE_TTL = 24 * 60 * 60 * 1000 // 1 day

const contentfulClient = contentful.createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
})

const fetchDataFromContentful = async () => {
  const response = await contentfulClient.getEntries()
  return filterContentfulResponse(response)
}

// We filter the response here because library is the top level content type.
// We do this to reduce the payload size to the client.
const filterContentfulResponse = (response) => {
  const MEDITATION_LIBRARY_CONTENT_TYPE = 'library'
  return response.items.filter((item) => item.sys.contentType.sys.id === MEDITATION_LIBRARY_CONTENT_TYPE).map((item) => stripMetadata(item))
}

// Recursively strip metadata so that only the fields, contentfulId, and contentType are returned.
const stripMetadata = (contentfulItem) => {
  const {
    fields,
    sys: {
      id,
      contentType: {
        sys: {
          id: contentType,
        },
      },
    },
  } = contentfulItem
  const strippedItem = Object.keys(fields).reduce((acc, key) => {
    if (Array.isArray(fields[key])) {
      acc[key] = fields[key].map((item) => stripMetadata(item))
    } else {
      acc[key] = fields[key]
    }
    return acc
  }, {})

  strippedItem.contentfulId = id
  strippedItem.contentfulContentType = contentType
  return strippedItem
}

const getCachedContentfulData = async () => {
  const now = Date.now()
  if (!cache || (now - lastFetched) > CACHE_TTL) {
    console.log('Refreshing cache...')
    try {
      cache = await fetchDataFromContentful()
      lastFetched = now
    } catch (e) {
      console.error('Contentful fetch failed:', e.message)
      // fallback to old cache if available
    }
  } else {
    console.log('Serving cached data...')
  }
  return cache
}

app.get('/data', async (req, res) => {
  const data = await getCachedContentfulData()
  if (!data) return res.status(503).send({ error: 'Data unavailable' })
  res.json(data)
})

app.listen(port, () => {
  console.log(`Cache server running on port ${port}`)
})
