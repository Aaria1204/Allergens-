export type PercentileBand = 'green' | 'amber' | 'red' | 'unknown'

export function getPercentileBand(percentile: number | null): PercentileBand {
  if (percentile == null) return 'unknown'
  // Callers display Math.round(percentile) (e.g. "76%") — band the same
  // rounded value so the color always matches what's shown, instead of
  // classifying off the raw float (75.5 would round-display as "76%" but
  // band as amber if compared unrounded).
  const rounded = Math.round(percentile)
  if (rounded >= 76) return 'green'
  if (rounded >= 50) return 'amber'
  return 'red'
}

export const bandColors: Record<PercentileBand, string> = {
  green: '#22603c',
  amber: '#d78d00',
  red: '#c33e00',
  unknown: '#8b6b5a',
}

export const bandBadgeTextColors: Record<PercentileBand, string> = {
  green: '#22603c',
  amber: '#8a5c06',
  red: '#7a2b00',
  unknown: '#8b6b5a',
}
