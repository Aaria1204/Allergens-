import type { Allergen, Restaurant, RestaurantMenu } from '../api/restaurants'
import { MenuPanel } from './MenuPanel'

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="font-body text-[13px] text-muted">{label}</span>
      <span className="font-body text-[13px] font-bold text-ink">{value}</span>
    </div>
  )
}

function NoSelectionPanel({ restaurants }: { restaurants: Restaurant[] }) {
  const testedPlaces = restaurants.length
  const highlySafe = restaurants.filter(
    (r) => r.allergen_percentile != null && r.allergen_percentile >= 80,
  ).length

  return (
    <div className="flex flex-col items-center p-8 text-center">
      <h2 className="font-heading text-sm font-bold text-ink">No Restaurant Selected</h2>
      <p className="mt-3 font-body text-sm leading-relaxed text-muted">
        Select any restaurant pin on the map and click{' '}
        <span className="font-bold text-brand">View menu →</span> to analyze safe allergen
        options.
      </p>

      <div className="mt-8 w-full rounded-xl bg-cream p-4 text-left">
        <h3 className="font-heading text-[10px] font-bold uppercase tracking-wide text-muted">
          Area at a Glance
        </h3>
        <div className="mt-3 space-y-2">
          <StatRow label="Tested Places" value={String(testedPlaces)} />
          <StatRow label="Highly Safe (>80%)" value={String(highlySafe)} />
        </div>
      </div>
    </div>
  )
}

export function RightPanel({
  restaurants,
  activeAllergens,
  menuRestaurant,
  menuData,
  menuLoading,
  menuError,
  onExitMenu,
  onRetryMenu,
}: {
  restaurants: Restaurant[]
  activeAllergens: Set<Allergen>
  menuRestaurant: Restaurant | null
  menuData: RestaurantMenu | null
  menuLoading: boolean
  menuError: string | null
  onExitMenu: () => void
  onRetryMenu: () => void
}) {
  return (
    <>
      <aside className="hidden w-[330px] shrink-0 overflow-x-hidden overflow-y-auto border-l border-hairline bg-surface md:block">
        {menuRestaurant ? (
          <MenuPanel
            restaurant={menuRestaurant}
            menu={menuData}
            loading={menuLoading}
            error={menuError}
            activeAllergens={activeAllergens}
            onExit={onExitMenu}
            onRetry={onRetryMenu}
          />
        ) : (
          <NoSelectionPanel restaurants={restaurants} />
        )}
      </aside>

      <div
        className={`fixed inset-x-0 bottom-0 z-30 h-[60vh] overflow-hidden rounded-t-2xl bg-surface shadow-2xl transition-transform duration-300 ease-out md:hidden ${
          menuRestaurant ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {menuRestaurant && (
          <MenuPanel
            restaurant={menuRestaurant}
            menu={menuData}
            loading={menuLoading}
            error={menuError}
            activeAllergens={activeAllergens}
            onExit={onExitMenu}
            onRetry={onRetryMenu}
          />
        )}
      </div>
    </>
  )
}
