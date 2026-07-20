import { useMemo, useState } from 'react'
import {
  ALL_VIBE_TAGS,
  ApiError,
  fetchRestaurantMenu,
  type Allergen,
  type Restaurant,
  type RestaurantMenu,
  type VibeTag,
} from './api/restaurants'
import { MapView } from './components/MapView'
import { Navbar } from './components/Navbar'
import { RightPanel } from './components/RightPanel'
import { Sidebar } from './components/Sidebar'
import { useRestaurants } from './hooks/useRestaurants'
import { filterBySearch, filterByVibe } from './lib/restaurantFilters'

function App() {
  const [activeAllergens, setActiveAllergens] = useState<Set<Allergen>>(
    new Set(['gluten', 'tree_nut']),
  )
  const [activeVibes, setActiveVibes] = useState<Set<VibeTag>>(new Set())
  const [searchText, setSearchText] = useState('')
  const [menuRestaurant, setMenuRestaurant] = useState<Restaurant | null>(null)
  const [menuData, setMenuData] = useState<RestaurantMenu | null>(null)
  const [menuLoading, setMenuLoading] = useState(false)
  const [menuError, setMenuError] = useState<string | null>(null)
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<number | null>(null)
  const [mobilePrefsOpen, setMobilePrefsOpen] = useState(true)

  const {
    restaurants,
    loading: restaurantsLoading,
    error: restaurantsError,
    retry: retryRestaurants,
  } = useRestaurants(activeAllergens)

  const visibleRestaurants = useMemo(
    () => filterBySearch(filterByVibe(restaurants, activeVibes), searchText),
    [restaurants, activeVibes, searchText],
  )

  const showNoResultsMessage =
    !restaurantsLoading && !restaurantsError && visibleRestaurants.length === 0

  const handleToggleAllergen = (allergen: Allergen) => {
    setActiveAllergens((prev) => {
      const next = new Set(prev)
      if (next.has(allergen)) next.delete(allergen)
      else next.add(allergen)
      return next
    })
  }

  const handleToggleVibe = (vibe: VibeTag) => {
    setActiveVibes((prev) => {
      const next = new Set(prev)
      if (next.has(vibe)) next.delete(vibe)
      else next.add(vibe)
      return next
    })
  }

  const handleSelectAllVibes = () => setActiveVibes(new Set(ALL_VIBE_TAGS))

  const handleViewMenu = (restaurant: Restaurant) => {
    setMenuRestaurant(restaurant)
    setMenuData(null)
    setMenuError(null)
    setMenuLoading(true)

    fetchRestaurantMenu(restaurant.id)
      .then(setMenuData)
      .catch((err: unknown) => {
        if (err instanceof ApiError && err.status === 404) {
          setMenuError("Couldn't load this restaurant.")
        } else {
          setMenuError('Could not load this menu. The backend may be waking up or unreachable.')
        }
      })
      .finally(() => setMenuLoading(false))
  }

  const handleRetryMenu = () => {
    if (menuRestaurant) handleViewMenu(menuRestaurant)
  }

  const handleExitMenu = () => {
    setMenuRestaurant(null)
    setMenuData(null)
    setMenuError(null)
    setSelectedRestaurantId(null)
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden font-body text-ink">
      <Navbar
        isMobilePanelOpen={mobilePrefsOpen}
        onToggleMobilePanel={() => setMobilePrefsOpen((v) => !v)}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          activeAllergens={activeAllergens}
          onToggleAllergen={handleToggleAllergen}
          activeVibes={activeVibes}
          onToggleVibe={handleToggleVibe}
          onSelectAllVibes={handleSelectAllVibes}
          searchText={searchText}
          onSearchChange={setSearchText}
          showNoResultsMessage={showNoResultsMessage}
          mobileOpen={mobilePrefsOpen}
          onMobileClose={() => setMobilePrefsOpen(false)}
        />
        <MapView
          restaurants={visibleRestaurants}
          loading={restaurantsLoading}
          error={restaurantsError}
          onRetry={retryRestaurants}
          selectedId={selectedRestaurantId}
          onSelect={setSelectedRestaurantId}
          onViewMenu={handleViewMenu}
        />
        <RightPanel
          restaurants={visibleRestaurants}
          activeAllergens={activeAllergens}
          menuRestaurant={menuRestaurant}
          menuData={menuData}
          menuLoading={menuLoading}
          menuError={menuError}
          onExitMenu={handleExitMenu}
          onRetryMenu={handleRetryMenu}
        />
      </div>
    </div>
  )
}

export default App
