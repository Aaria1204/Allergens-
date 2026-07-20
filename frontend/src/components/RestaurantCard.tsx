import type { Restaurant } from '../api/restaurants'
import { GoogleMapsLogo } from './GoogleMapsLogo'
import { CloseIcon } from './icons'
import { PercentileBadge } from './PercentileBadge'

export function RestaurantCard({
  restaurant,
  anchor,
  onClose,
  onViewMenu,
}: {
  restaurant: Restaurant
  anchor: { x: number; y: number } | null
  onClose: () => void
  onViewMenu: () => void
}) {
  if (!anchor) return null

  return (
    <div
      className="absolute z-10 w-[310px] rounded-xl border border-hairline bg-cream p-[18px] shadow-[0px_12px_24px_0px_rgba(74,44,29,0.12)]"
      style={{
        left: anchor.x,
        top: anchor.y,
        transform: 'translate(-50%, calc(-100% - 18px))',
      }}
    >
      {/* pointer, connects the card to its pin */}
      <div className="absolute -bottom-[7px] left-1/2 h-3.5 w-3.5 -translate-x-1/2 rotate-45 border-r border-b border-hairline bg-cream" />

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
