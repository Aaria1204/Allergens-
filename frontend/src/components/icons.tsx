type IconProps = {
  className?: string
}

export function SearchIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor">
      <circle cx="9" cy="9" r="6" strokeWidth="1.8" />
      <path d="M17 17l-3.5-3.5" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export function ChevronDownIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor">
      <path d="M5 8l5 5 5-5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function PinIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
      <circle cx="10" cy="10" r="6" />
    </svg>
  )
}

export function RecenterIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor">
      <circle cx="10" cy="10" r="2" fill="currentColor" stroke="none" />
      <path
        d="M10 2v3M10 15v3M2 10h3M15 10h3"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function PlusIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor">
      <path d="M10 4v12M4 10h12" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export function MinusIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor">
      <path d="M4 10h12" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export function MenuIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor">
      <path d="M3 6h14M3 10h14M3 14h14" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export function CloseIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 16" fill="none" stroke="currentColor">
      <path d="M5 3l10 10" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M15 3L5 13" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export function MapPinTeardropIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
      <path d="M10 2a6 6 0 0 0-6 6c0 4.5 6 10 6 10s6-5.5 6-10a6 6 0 0 0-6-6Zm0 8.25A2.25 2.25 0 1 1 10 5.75a2.25 2.25 0 0 1 0 4.5Z" />
    </svg>
  )
}

export function EditIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor">
      <path
        d="M13.5 3.5a1.5 1.5 0 0 1 2 2L7 14 3 15l1-4 9.5-9.5Z"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
