import { CloseIcon, MenuIcon } from './icons'

function LocationDot() {
  return (
    <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 20 20">
      <circle cx="10" cy="10" r="9" fill="none" stroke="#c33e00" strokeWidth="1.5" opacity="0.35" />
      <circle cx="10" cy="10" r="5" fill="#c33e00" />
    </svg>
  )
}

export function Navbar({
  isMobilePanelOpen,
  onToggleMobilePanel,
}: {
  isMobilePanelOpen: boolean
  onToggleMobilePanel: () => void
}) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-hairline bg-cream px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleMobilePanel}
          aria-label={isMobilePanelOpen ? 'Close preferences' : 'Open preferences'}
          className="text-ink md:hidden"
        >
          {isMobilePanelOpen ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
        </button>
        <div className="flex flex-col leading-tight">
          <span className="font-heading text-[22px] font-bold text-brand">peínao</span>
          <span className="hidden font-body text-[11px] text-muted md:block">
            A safer way to eat out
          </span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 rounded-full border border-hairline bg-cream px-4 py-2">
        <LocationDot />
        <span className="font-body text-[13px] font-bold whitespace-nowrap text-ink">
          <span className="md:hidden">Saint Marks, NY</span>
          <span className="hidden md:inline">Saint Marks, New York</span>
        </span>
      </div>
    </header>
  )
}
