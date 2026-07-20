const API_BASE_URL = 'https://allergens.onrender.com'
const REQUEST_TIMEOUT_MS = 60_000

export class ApiError extends Error {
  status?: number

  constructor(message: string, status?: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function apiFetch(path: string, options?: RequestInit): Promise<Response> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, { ...options, signal: controller.signal })

    if (!response.ok) {
      throw new ApiError(`Request failed (${response.status})`, response.status)
    }

    return response
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new ApiError('Request timed out')
    }
    throw err
  } finally {
    clearTimeout(timeoutId)
  }
}

export type Allergen = 'gluten' | 'tree_nut'
export const ALL_ALLERGENS: Allergen[] = ['gluten', 'tree_nut']

export type VibeTag = 'Fine Dining' | 'Cafe/Bistro' | 'Fast Casual'
export const ALL_VIBE_TAGS: VibeTag[] = ['Fast Casual', 'Cafe/Bistro', 'Fine Dining']

export interface Restaurant {
  id: number
  name: string | null
  address: string | null
  google_rating: number | null
  vibe_tag: VibeTag | null
  vibe_tag_confidence: string | null
  allergen_percentile: number | null
}

export async function fetchRestaurants(allergen: Allergen): Promise<Restaurant[]> {
  const response = await apiFetch(`/restaurants?allergen=${allergen}`)
  return response.json()
}

export type DishAllergenStatus = 'declared' | 'likely'

export interface DishAllergen {
  allergen: Allergen
  status: DishAllergenStatus
  confidence: string | null
  reason: string | null
}

export interface Dish {
  id: number
  menu_section: string | null
  dish_name: string | null
  description: string | null
  verification_status: string | null
  allergens: DishAllergen[]
}

export interface RestaurantMenu extends Restaurant {
  dishes: Dish[]
}

export async function fetchRestaurantMenu(id: number): Promise<RestaurantMenu> {
  const response = await apiFetch(`/restaurants/${id}/menu`)
  return response.json()
}
