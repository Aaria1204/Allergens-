import { useRef, useState } from 'react'
import type { Allergen } from '../api/restaurants'
import { ALLERGEN_LABELS } from '../lib/dishStatus'
import { useClickOutside } from '../hooks/useClickOutside'
import { PlusIcon } from './icons'

export function AllergenAddMenu({
  inactiveAllergens,
  onAdd,
}: {
  inactiveAllergens: Allergen[]
  onAdd: (allergen: Allergen) => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useClickOutside(wrapperRef, () => setIsOpen(false))

  if (inactiveAllergens.length === 0) return null

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="inline-flex items-center gap-1 rounded-full border border-dashed border-hairline px-3 py-1.5 font-body text-[13px] font-bold text-muted"
      >
        <PlusIcon className="h-3 w-3" /> Add
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 z-20 mt-2 w-36 rounded-lg border border-hairline bg-white p-1.5 shadow-md">
          {inactiveAllergens.map((allergen) => (
            <button
              key={allergen}
              type="button"
              onClick={() => {
                onAdd(allergen)
                setIsOpen(false)
              }}
              className="w-full rounded-md px-2 py-1.5 text-left font-body text-[13px] text-ink hover:bg-cream"
            >
              {ALLERGEN_LABELS[allergen]}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
