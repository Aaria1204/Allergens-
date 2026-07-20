import { bandColors, getPercentileBand } from './percentileBand'

const DOT_RADIUS = 11
const DOT_CENTER_X = 22
const DOT_CENTER_Y = 13
const TAG_WIDTH = 36
const TAG_HEIGHT = 18
const TAG_Y = 28
const SVG_WIDTH = 44
const SVG_HEIGHT = 50
const RIPPLE_MARGIN = 12

export interface PinIconSpec {
  url: string
  size: { width: number; height: number }
  anchor: { x: number; y: number }
}

export function buildPinIcon(percentile: number | null, options?: { selected?: boolean }): PinIconSpec {
  const selected = options?.selected ?? false
  const band = getPercentileBand(percentile)
  const color = bandColors[band]
  const label = percentile == null ? 'N/A' : `${Math.round(percentile)}%`

  const margin = selected ? RIPPLE_MARGIN : 0
  const width = SVG_WIDTH + margin * 2
  const height = SVG_HEIGHT + margin
  const dotX = DOT_CENTER_X + margin
  const dotY = DOT_CENTER_Y + margin
  const tagY = TAG_Y + margin
  const dotFill = selected ? color : '#4a2c1d'

  const selectionRings = selected
    ? `
      <circle cx="${dotX}" cy="${dotY}" r="${DOT_RADIUS}" fill="none" stroke="${color}" stroke-width="3" opacity="0.75">
        <animate attributeName="r" values="${DOT_RADIUS};${DOT_RADIUS + 9}" dur="1.6s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.75;0" dur="1.6s" repeatCount="indefinite" />
      </circle>
      <circle cx="${dotX}" cy="${dotY}" r="${DOT_RADIUS + 3}" fill="none" stroke="${color}" stroke-width="2" opacity="0.9" />
    `
    : ''

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      ${selectionRings}
      <circle cx="${dotX}" cy="${dotY}" r="${DOT_RADIUS}" fill="${dotFill}" stroke="white" stroke-width="${selected ? 3 : 2}" />
      <rect x="${dotX - TAG_WIDTH / 2}" y="${tagY}" width="${TAG_WIDTH}" height="${TAG_HEIGHT}" rx="6" fill="${color}" />
      <text x="${dotX}" y="${tagY + TAG_HEIGHT / 2}" text-anchor="middle" dominant-baseline="central" font-family="Karla, sans-serif" font-weight="700" font-size="11" fill="white">${label}</text>
    </svg>
  `.trim()

  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
    size: { width, height },
    anchor: { x: dotX, y: dotY },
  }
}

const CLUSTER_SIZE = 44
const CLUSTER_RADIUS = 18
const CLUSTER_CENTER = CLUSTER_SIZE / 2

export function buildClusterIcon(count: number): PinIconSpec {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${CLUSTER_SIZE}" height="${CLUSTER_SIZE}" viewBox="0 0 ${CLUSTER_SIZE} ${CLUSTER_SIZE}">
      <circle cx="${CLUSTER_CENTER}" cy="${CLUSTER_CENTER}" r="${CLUSTER_RADIUS}" fill="#4a2c1d" stroke="white" stroke-width="2.5" />
      <text x="${CLUSTER_CENTER}" y="${CLUSTER_CENTER}" text-anchor="middle" dominant-baseline="central" font-family="Karla, sans-serif" font-weight="700" font-size="13" fill="white">${count}</text>
    </svg>
  `.trim()

  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
    size: { width: CLUSTER_SIZE, height: CLUSTER_SIZE },
    anchor: { x: CLUSTER_CENTER, y: CLUSTER_CENTER },
  }
}
