// Taken from ChatGPT
export function formatSecondsForDisplay(sec) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return [h, m, s]
    .map((n, i) => (i === 0 && n === 0 ? null : String(n).padStart(2, '0')))
    .filter(Boolean)
    .join(':');
}
