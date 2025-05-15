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

export function stripUidSymbols(uid) {
  if (uid === undefined) return undefined;
  return uid.split('.').join('_').split(' ').join('').split(',').join('_')
}
