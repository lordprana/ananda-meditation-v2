import { parseISO } from 'date-fns'
import ViewLogs from '../components/view-logs/ViewLogs'
import { useSelector } from 'react-redux'
import { selectLogs } from '../store/meditationLogsSlice'

const ViewLogsScreen = () => {
  // const logs = [
  //   {
  //     duration: 160,
  //     timestamp: Math.floor(parseISO('2024-12-22T00:11:52', 'yyyy-MM-dd', new Date()).getTime() / 1000),
  //     title: 'hel'
  //   },
  //   {
  //     duration: 160,
  //     timestamp: Math.floor(parseISO('2025-05-23T00:11:52', 'yyyy-MM-dd', new Date()).getTime() / 1000),
  //     title: ' lo'
  //   },
  //   {
  //     duration: 160,
  //     timestamp: Math.floor(parseISO('2025-05-23T00:11:53', 'yyyy-MM-dd', new Date()).getTime() / 1000),
  //     title: 'mi'
  //   },
  //   {
  //     duration: 160,
  //     timestamp: Math.floor(parseISO('2025-11-24T00:11:53', 'yyyy-MM-dd', new Date()).getTime() / 1000),
  //     title: 'amigo'
  //   },
  // ]
  const logs = useSelector(selectLogs)
  return <ViewLogs logs={logs}/>
}

export default ViewLogsScreen
