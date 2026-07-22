import { useLayoutEffect, useRef, useState } from 'react'
import type { Restaurant } from '../api/restaurants'
import { GoogleMapsLogo } from './GoogleMapsLogo'
import { CloseIcon } from './icons'
import { PercentileBadge } from './PercentileBadge'

const CARD_WIDTH = 310
const EDGE_PADDING = 12
const PIN_GAP = 18
const FALLBACK_HEIGHT = 220

export function RestaurantCard({
  restaurant,
  anchor,
  onClose,
  onViewMenu,
}: {
  restaurant: Restaurant
  anchor: { x: number; y: number; containerWidth: number; containerHeight: number } | null
  onClose: () => void
  onViewMenu: () => void
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [cardHeight, setCardHeight] = useState(0)

  useLayoutEffect(() => {
    if (cardRef.current) setCardHeight(cardRef.current.offsetHeight)
  }, [restaurant, anchor])

  if (!anchor) return null

  const containerWidth = anchor.containerWidth || Infinity
  const containerHeight = anchor.containerHeight || Infinity
  const height = cardHeight || FALLBACK_HEIGHT

  // Horizontal: keep the card's left edge within the visible container,
  // independent of where the pin sits.
  const idealLeft = anchor.x - CARD_WIDTH / 2
  const maxLeft = Math.max(containerWidth - CARD_WIDTH - EDGE_PADDING, EDGE_PADDING)
  const left = Math.min(Math.max(idealLeft, EDGE_PADDING), maxLeft)

  // Vertical: prefer showing above the pin, flip below if there isn't room.
  const flipBelow = anchor.y - height - PIN_GAP < EDGE_PADDING
  const top = flipBelow
    ? Math.min(anchor.y + PIN_GAP, Math.max(containerHeight - height - EDGE_PADDING, EDGE_PADDING))
    : Math.max(anchor.y - height - PIN_GAP, EDGE_PADDING)

  // The pointer stays under the actual pin x-position even when the card
  // itself has been shifted off-center to stay on screen.
  const tailLeft = Math.min(Math.max(anchor.x - left, 20), CARD_WIDTH - 20)

  return (
    <div
      ref={cardRef}
      className="absolute z-10 w-[310px] rounded-xl border border-hairline bg-cream p-[18px] shadow-[0px_12px_24px_0px_rgba(74,44,29,0.12)]"
      style={{ left, top }}
    >
      {/* pointer, connects the card to its pin */}
      <div
        className={`absolute h-3.5 w-3.5 -translate-x-1/2 rotate-45 bg-cream ${
          flipBelow ? '-top-[7px] border-t border-l border-hairline' : '-bottom-[7px] border-r border-b border-hairline'
        }`}
        style={{ left: tailLeft }}
      />

      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute top-3 right-3 text-muted"
      >
        <CloseIcon className="h-4 w-4" />
      </button>

      <div className="flex flex-col gap-2.5">
        <div>
          <h3 className="font-heading text-lg font-bold text-ink">
            {restaurant.name ?? 'Unnamed restaurant'}
          </h3>
          <p className="mt-0.5 font-body text-[13px] text-muted">
            {restaurant.address ?? 'Address unavailable'}
          </p>
        </div>

        <PercentileBadge percentile={restaurant.allergen_percentile} />

        <div className="flex items-center gap-1.5">
          {restaurant.google_rating != null && <GoogleMapsLogo className="h-3.5 w-auto shrink-0" />}
          <span className="font-body text-[13px] text-ink">
            {restaurant.google_rating != null
              ? `${restaurant.google_rating.toFixed(1)} stars`
              : 'Rating unavailable'}
          </span>
        </div>

        <button
          type="button"
          onClick={onViewMenu}
          className="mt-1 w-full rounded-lg bg-brand px-3 py-2.5 font-body text-[13px] font-bold text-white"
        >
          View menu →
        </button>
      </div>
    </div>
  )
}
