import { useSelector } from 'react-redux'
import { selectAllLibraryItemsByCallback } from '../store/meditationLibrariesSlice'

export const useAddParentMeditationDataToSegments = (segments) => {
  const segmentIds = segments.map((segment) => segment.contentfulId)
  const meditationMap = {}

  useSelector(selectAllLibraryItemsByCallback((item) => {
    if (item.segments) {
      const itemSegmentIds = item.segments.map((segment) => segment.contentfulId)
      const segmentId = itemSegmentIds.find((segmentId) => segmentIds.includes(segmentId))
      if (segmentId) {
        meditationMap[segmentId] = item
        return true
      } else {
        return false
      }
    }
  }))

  return segments.map((segment => ({
    thumbnailUrl: meditationMap[segment.contentfulId]?.thumbnailUrl,
    teacher: meditationMap[segment.contentfulId]?.teacher,
    ...segment,
  })))
}
