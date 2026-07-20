import type { Restaurant, VibeTag } from '../api/restaurants'

export function intersectRestaurants(lists: Restaurant[][]): Restaurant[] {
  if (lists.length === 0) return []
  if (lists.length === 1) return lists[0]

  const [first, ...rest] = lists
  const result: Restaurant[] = []

  for (const restaurant of first) {
    const matchesInOthers = rest.map((list) => list.find((r) => r.id === restaurant.id))
    if (matchesInOthers.every((match) => match !== undefined)) {
      const percentiles = [restaurant, ...matchesInOthers]
        .map((r) => r!.allergen_percentile)
        .filter((p): p is number => p != null)

      result.push({
        ...restaurant,
        allergen_percentile: percentiles.length > 0 ? Math.min(...percentiles) : null,
      })
    }
  }

  return result
}

export function filterByVibe(restaurants: Restaurant[], activeVibes: Set<VibeTag>): Restaurant[] {
  // Empty selection means no filter is applied (same as everything active),
  // not "show nothing" — the caller decides which chip that renders as.
  if (activeVibes.size === 0) return restaurants
  return restaurants.filter((r) => r.vibe_tag != null && activeVibes.has(r.vibe_tag))
}

export function unionRestaurants(lists: Restaurant[][]): Restaurant[] {
  const byId = new Map<number, Restaurant>()
  for (const list of lists) {
    for (const restaurant of list) {
      if (!byId.has(restaurant.id)) byId.set(restaurant.id, restaurant)
    }
  }
  return Array.from(byId.values())
}

export function filterBySearch(restaurants: Restaurant[], search: string): Restaurant[] {
  const query = search.trim().toLowerCase()
  if (!query) return restaurants
  return restaurants.filter((r) => r.name?.toLowerCase().includes(query))
}
