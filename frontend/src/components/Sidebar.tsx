import { ALL_ALLERGENS, ALL_VIBE_TAGS, type Allergen, type VibeTag } from '../api/restaurants'
import { AllergenAddMenu } from './AllergenAddMenu'
import { AllergenIcon } from './allergenIcons'
import { Chip } from './Chip'
import { ChevronDownIcon, CloseIcon, SearchIcon } from './icons'

export function Sidebar({
  activeAllergens,
  onToggleAllergen,
  activeVibes,
  onToggleVibe,
  onSelectAllVibes,
  searchText,
  onSearchChange,
  showNoResultsMessage,
  mobileOpen,
  onMobileClose,
}: {
  activeAllergens: Set<Allergen>
  onToggleAllergen: (allergen: Allergen) => void
  activeVibes: Set<VibeTag>
  onToggleVibe: (vibe: VibeTag) => void
  onSelectAllVibes: () => void
  searchText: string
  onSearchChange: (value: string) => void
  showNoResultsMessage: boolean
  mobileOpen: boolean
  onMobileClose: () => void
}) {
  const inactiveAllergens = ALL_ALLERGENS.filter((a) => !activeAllergens.has(a))
  // Empty selection behaves as "All" (nothing to filter out), so both states
  // should visually highlight the "All" chip.
  const allVibesActive = activeVibes.size === 0 || activeVibes.size === ALL_VIBE_TAGS.length

  return (
    <aside
      className={`fixed inset-x-0 top-16 bottom-0 z-40 divide-y divide-hairline overflow-y-auto bg-surface px-6 transition-transform duration-300 ease-out md:static md:z-auto md:w-[290px] md:shrink-0 md:translate-x-0 md:border-r md:border-hairline ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <section className="py-6">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h2 className="font-heading text-lg font-bold text-ink">Your Preferences</h2>
            <p className="mt-1 font-body text-[13px] text-muted">
              We cross-check menus against your needs.
            </p>
          </div>
          <button
            type="button"
            onClick={onMobileClose}
            aria-label="Close preferences"
            className="shrink-0 text-muted md:hidden"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>
      </section>

      <section className="py-6">
        <div className="flex items-center gap-2 rounded-full border border-hairline bg-white px-4 py-2.5">
          <SearchIcon className="h-4 w-4 shrink-0 text-muted" />
          <input
            type="text"
            value={searchText}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search restaurants"
            className="w-full bg-transparent font-body text-[13px] text-ink placeholder:text-muted focus:outline-none"
          />
        </div>
        {showNoResultsMessage && (
          <p className="mt-2 font-body text-[13px] text-accent">No restaurants match your filters.</p>
        )}
      </section>

      <section className="py-6">
        <p className="font-body text-[13px] font-bold uppercase text-ink">Location</p>
        <button
          type="button"
          className="mt-3 flex w-full items-center justify-between rounded-full border border-hairline bg-white px-4 py-2.5"
        >
          <span className="font-body text-[13px] text-ink">Saint Marks, New York</span>
          <ChevronDownIcon className="h-4 w-4 shrink-0 text-muted" />
        </button>
      </section>

      <section className="py-6">
        <p className="font-body text-[13px] font-bold uppercase text-ink">Active Allergens</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {activeAllergens.has('tree_nut') && (
            <Chip variant="tag" onClick={() => onToggleAllergen('tree_nut')}>
              <AllergenIcon allergen="tree_nut" variant="dark" className="h-4 w-4 shrink-0" />
              Nuts ✕
            </Chip>
          )}
          {activeAllergens.has('gluten') && (
            <Chip variant="tag" onClick={() => onToggleAllergen('gluten')}>
              <AllergenIcon allergen="gluten" variant="dark" className="h-4 w-4 shrink-0" />
              Gluten ✕
            </Chip>
          )}
          <AllergenAddMenu inactiveAllergens={inactiveAllergens} onAdd={onToggleAllergen} />
        </div>
      </section>

      <section className="py-6">
        <p className="font-body text-[13px] font-bold uppercase text-ink">Vibe</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Chip
            variant={allVibesActive ? 'vibe-selected' : 'vibe-unselected'}
            onClick={onSelectAllVibes}
          >
            All
          </Chip>
          {ALL_VIBE_TAGS.map((vibe) => (
            <Chip
              key={vibe}
              variant={activeVibes.has(vibe) ? 'vibe-selected' : 'vibe-unselected'}
              onClick={() => onToggleVibe(vibe)}
            >
              {vibe}
            </Chip>
          ))}
        </div>
      </section>
    </aside>
  )
}
