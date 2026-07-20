import { useEffect, useState } from 'react'
import { ALL_ALLERGENS, fetchRestaurants, type Allergen, type Restaurant } from '../api/restaurants'
import { intersectRestaurants, unionRestaurants } from '../lib/restaurantFilters'

export function useRestaurants(activeAllergens: Set<Allergen>) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [retryToken, setRetryToken] = useState(0)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    const noAllergensActive = activeAllergens.size === 0
    // With nothing selected there's nothing to check against, so every
    // restaurant reads as safe — fetch the union of all allergens (for full
    // coverage) rather than intersecting a would-be-empty set.
    const allergens = noAllergensActive ? ALL_ALLERGENS : Array.from(activeAllergens)

    Promise.all(allergens.map((allergen) => fetchRestaurants(allergen)))
      .then((lists) => {
        if (cancelled) return
        if (noAllergensActive) {
          setRestaurants(unionRestaurants(lists).map((r) => ({ ...r, allergen_percentile: 100 })))
        } else {
          setRestaurants(intersectRestaurants(lists))
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError(
            'Could not load restaurants. The backend may still be waking up or unreachable.',
          )
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [activeAllergens, retryToken])

  const retry = () => setRetryToken((t) => t + 1)

  return { restaurants, loading, error, retry }
}
