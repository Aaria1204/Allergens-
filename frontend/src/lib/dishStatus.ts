import type { Allergen, Dish, DishAllergen } from '../api/restaurants'

export type DishStatus = 'safe' | 'unsafe' | 'uncertain'

export interface DishStatusResult {
  status: DishStatus
  matches: DishAllergen[]
}

export const ALLERGEN_LABELS: Record<Allergen, string> = {
  gluten: 'Gluten',
  tree_nut: 'Nuts',
}

export const dishStatusColors: Record<DishStatus, string> = {
  safe: '#22603c',
  unsafe: '#c33e00',
  uncertain: '#d78d00',
}

export function getDishStatus(dish: Dish, activeAllergens: Set<Allergen>): DishStatusResult {
  const matches = dish.allergens.filter((a) => activeAllergens.has(a.allergen))

  if (matches.length === 0) return { status: 'safe', matches: [] }

  const declared = matches.filter((m) => m.status === 'declared')
  if (declared.length > 0) return { status: 'unsafe', matches: declared }

  return { status: 'uncertain', matches }
}

export function describeDishStatus(result: DishStatusResult): string | null {
  if (result.status === 'safe') return null

  const allergenNames = result.matches.map((m) => ALLERGEN_LABELS[m.allergen]).join(', ')

  if (result.status === 'unsafe') return `Contains ${allergenNames}`
  return `May contain ${allergenNames} — ask kitchen to verify`
}
