// Taken from ChatGPT
export function formatSecondsForDisplay(sec) {
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = sec % 60
  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  } else if (m > 0) {
    return `${m}:${String(s).padStart(2, '0')}`
  } else {
    return `0:${String(s).padStart(2, '0')}`
  }
}

export function formatSecondsForDisplayInWords(sec) {
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = sec % 60
  const hourLabel = h === 1 ? 'hour' : 'hours'
  const minuteLabel = m === 1 ? 'minute' : 'minutes'
  const secondsLabel = s === 1 ? 'second' : 'seconds'
  return `${h > 0 ? `${h} ${hourLabel}` : ''} ${m > 0 ? `${m} ${minuteLabel}` : ''} ${s > 0 ? `${s} ${secondsLabel}` : ''}`.trim()
}

export function formatSecondsForDisplayInLetters(sec, includeSpace = false) {
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = sec % 60
  const hourLabel = 'h' + (includeSpace ? ' ' : '')
  const minuteLabel = 'm' + (includeSpace ? ' ' : '')
  const secondsLabel = 's'
  return `${h > 0 ? `${h}${hourLabel}` : ''}${m > 0 ? `${m}${minuteLabel}` : ''}${s > 0 ? `${s}${secondsLabel}` : ''}`.trim()
}

export function stripUidSymbols(uid) {
  if (uid === undefined) return undefined
  return uid.split('.').join('_').split(' ').join('').split(',').join('_')
}

export const dedupeWithComparator = (arr, compFunc) =>
  arr.reduce((acc, item) => acc.find(compFunc(item)) ? acc : [...acc, item], [])
