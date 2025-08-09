// Very simple word-diff. Returns an array of segments: { type: 'same'|'added'|'removed', text }
export function computeWordDiff(original, corrected) {
  const a = (original || '').trim().split(/\s+/)
  const b = (corrected || '').trim().split(/\s+/)

  // Build LCS table
  const dp = Array(a.length + 1)
    .fill(null)
    .map(() => Array(b.length + 1).fill(0))
  for (let i = a.length - 1; i >= 0; i--) {
    for (let j = b.length - 1; j >= 0; j--) {
      dp[i][j] = a[i] === b[j] ? 1 + dp[i + 1][j + 1] : Math.max(dp[i + 1][j], dp[i][j + 1])
    }
  }

  const segments = []
  let i = 0, j = 0
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      segments.push({ type: 'same', text: a[i] })
      i++; j++
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      segments.push({ type: 'removed', text: a[i] })
      i++
    } else {
      segments.push({ type: 'added', text: b[j] })
      j++
    }
  }
  while (i < a.length) {
    segments.push({ type: 'removed', text: a[i++] })
  }
  while (j < b.length) {
    segments.push({ type: 'added', text: b[j++] })
  }
  return segments
}


