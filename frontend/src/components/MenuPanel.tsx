import { useMemo, useState } from 'react'
import type { Allergen, Dish, Restaurant, RestaurantMenu } from '../api/restaurants'
import {
  describeDishStatus,
  dishStatusColors,
  getDishStatus,
  type DishStatus,
  type DishStatusResult,
} from '../lib/dishStatus'
import { AllergenIcon, type AllergenIconVariant } from './allergenIcons'
import { DishStatusIcon } from './dishStatusIcons'
import { GoogleMapsLogo } from './GoogleMapsLogo'
import { PercentileBadge } from './PercentileBadge'

const WARNING_ICON_VARIANT: Partial<Record<DishStatus, AllergenIconVariant>> = {
  unsafe: 'orange',
  uncertain: 'gold',
}

const FILTERS: { key: 'all' | DishStatus; label: string; color: string }[] = [
  { key: 'all', label: 'All', color: '#4a2c1d' },
  { key: 'safe', label: 'Safe', color: dishStatusColors.safe },
  { key: 'unsafe', label: 'Unsafe', color: dishStatusColors.unsafe },
  { key: 'uncertain', label: 'Uncertain', color: dishStatusColors.uncertain },
]

function FilterChip({
  label,
  count,
  active,
  color,
  onClick,
}: {
  label: string
  count: number
  active: boolean
  color: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex shrink-0 items-center gap-0.5 rounded-full border px-2 py-1.5 font-body text-xs font-bold whitespace-nowrap ${
        active ? 'border-transparent text-white' : 'border-hairline bg-white text-ink'
      }`}
      style={active ? { backgroundColor: color } : undefined}
    >
      {label} <span className="opacity-80">{count}</span>
    </button>
  )
}

function DishRow({ dish, result }: { dish: Dish; result: DishStatusResult }) {
  const warning = describeDishStatus(result)
  const iconVariant = WARNING_ICON_VARIANT[result.status]
  const matchedAllergens = [...new Set(result.matches.map((m) => m.allergen))]

  return (
    <div className="flex gap-2.5">
      <DishStatusIcon status={result.status} className="mt-0.5 h-5 w-5 shrink-0" />
      <div className="min-w-0">
        <p className="font-body text-sm font-bold break-words text-ink">{dish.dish_name}</p>
        {dish.description && (
          <p className="font-body text-xs break-words text-muted">{dish.description}</p>
        )}
        {warning && iconVariant && (
          <div className="mt-0.5 flex items-start gap-1">
            {matchedAllergens.map((allergen) => (
              <AllergenIcon
                key={allergen}
                allergen={allergen}
                variant={iconVariant}
                className="mt-0.5 h-3.5 w-3.5 shrink-0"
              />
            ))}
            <p className="font-body text-xs font-bold" style={{ color: dishStatusColors[result.status] }}>
              {warning}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export function MenuPanel({
  restaurant,
  menu,
  loading,
  error,
  activeAllergens,
  onExit,
  onRetry,
}: {
  restaurant: Restaurant
  menu: RestaurantMenu | null
  loading: boolean
  error: string | null
  activeAllergens: Set<Allergen>
  onExit: () => void
  onRetry: () => void
}) {
  const [filter, setFilter] = useState<'all' | DishStatus>('all')

  const dishesWithStatus = useMemo(() => {
    if (!menu) return []
    return menu.dishes.map((dish) => ({ dish, result: getDishStatus(dish, activeAllergens) }))
  }, [menu, activeAllergens])

  const counts = useMemo(
    () => ({
      all: dishesWithStatus.length,
      safe: dishesWithStatus.filter((d) => d.result.status === 'safe').length,
      unsafe: dishesWithStatus.filter((d) => d.result.status === 'unsafe').length,
      uncertain: dishesWithStatus.filter((d) => d.result.status === 'uncertain').length,
    }),
    [dishesWithStatus],
  )

  const visibleDishes =
    filter === 'all' ? dishesWithStatus : dishesWithStatus.filter((d) => d.result.status === filter)

  const sections = useMemo(() => {
    const grouped = new Map<string, typeof visibleDishes>()
    for (const item of visibleDishes) {
      const key = item.dish.menu_section ?? 'Other'
      const existing = grouped.get(key)
      if (existing) existing.push(item)
      else grouped.set(key, [item])
    }
    return grouped
  }, [visibleDishes])

  return (
    <div className="flex h-full flex-col">
      <div className="flex shrink-0 items-center border-b border-hairline px-6 py-4">
        <button type="button" onClick={onExit} className="font-body text-[13px] font-bold text-muted">
          ← Exit menu
        </button>
      </div>

      <div className="shrink-0 border-b border-hairline px-6 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="font-heading text-lg font-bold break-words text-ink">{restaurant.name}</h2>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1">
                {restaurant.google_rating != null && (
                  <GoogleMapsLogo className="h-3.5 w-auto shrink-0" />
                )}
                <span className="font-body text-[13px] text-ink">
                  {restaurant.google_rating != null
                    ? `${restaurant.google_rating.toFixed(1)} stars`
                    : 'Rating unavailable'}
                </span>
              </span>
              {restaurant.vibe_tag && (
                <span className="rounded-md bg-hairline px-2 py-0.5 font-body text-xs text-ink">
                  {restaurant.vibe_tag}
                </span>
              )}
            </div>
          </div>
          <div className="shrink-0">
            <PercentileBadge percentile={restaurant.allergen_percentile} />
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex flex-1 items-center justify-center px-6 text-center">
          <p className="font-body text-[13px] text-muted">
            Loading menu… this can take up to 30–40s if the kitchen&rsquo;s waking up.
          </p>
        </div>
      )}

      {error && !loading && (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center">
          <p className="font-body text-[13px] text-muted">{error}</p>
          <button
            type="button"
            onClick={onRetry}
            className="font-body text-[13px] font-bold text-brand underline"
          >
            Retry
          </button>
        </div>
      )}

      {menu && !loading && !error && menu.dishes.length === 0 && (
        <div className="flex flex-1 items-center justify-center px-6 text-center">
          <p className="font-body text-[13px] text-muted">
            No menu data available for this restaurant.
          </p>
        </div>
      )}

      {menu && !loading && !error && menu.dishes.length > 0 && (
        <>
          <div className="flex shrink-0 flex-nowrap items-center gap-1 overflow-x-auto border-b border-hairline px-6 py-4">
            {FILTERS.map(({ key, label, color }) => (
              <FilterChip
                key={key}
                label={label}
                count={counts[key]}
                color={color}
                active={filter === key}
                onClick={() => setFilter(key)}
              />
            ))}
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            {Array.from(sections.entries()).map(([section, items]) => (
              <div key={section} className="mb-5 last:mb-0">
                <h3 className="mb-2 font-heading text-xs font-bold uppercase tracking-wide text-muted">
                  {section}
                </h3>
                <div className="flex flex-col gap-3">
                  {items.map(({ dish, result }) => (
                    <DishRow key={dish.id} dish={dish} result={result} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
