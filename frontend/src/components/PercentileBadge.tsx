import { bandBadgeTextColors, bandColors, getPercentileBand } from '../lib/percentileBand'

export function PercentileBadge({ percentile }: { percentile: number | null }) {
  if (percentile == null) {
    return (
      <span className="inline-flex w-fit items-center rounded-md bg-hairline px-2.5 py-1 font-body text-xs font-bold text-muted">
        Match score unavailable
      </span>
    )
  }

  const band = getPercentileBand(percentile)
  const badgeBg = `${bandColors[band]}26`
  const badgeText = bandBadgeTextColors[band]

  return (
    <span
      className="inline-flex w-fit items-center rounded-md px-2.5 py-1 font-body text-xs font-bold"
      style={{ backgroundColor: badgeBg, color: badgeText }}
    >
      {Math.round(percentile)}% Safe Match for You
    </span>
  )
}
