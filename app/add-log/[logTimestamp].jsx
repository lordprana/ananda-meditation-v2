import { useLocalSearchParams } from 'expo-router'
import { useSelector } from 'react-redux'
import { selectLogByTimestamp } from '../../store/meditationLogsSlice'
import AddLog from '../../components/add-log/AddLog'

const AddLogScreen = () => {
  let { logTimestamp, isComplete } = useLocalSearchParams()
  const existingLog = useSelector(selectLogByTimestamp(logTimestamp))
  console.log(logTimestamp)
  return (
    <AddLog logTimestamp={logTimestamp} existingLog={existingLog} isFirstCompletion={isComplete==='true'} />
  )
}

export default AddLogScreen
