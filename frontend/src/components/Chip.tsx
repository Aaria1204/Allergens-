import type { ReactNode } from 'react'

type ChipVariant = 'tag' | 'vibe-selected' | 'vibe-unselected'

const variantClasses: Record<ChipVariant, string> = {
  tag: 'rounded-lg bg-tag text-tag-ink',
  'vibe-selected': 'rounded-full bg-selected text-white',
  'vibe-unselected': 'rounded-full bg-white border border-hairline text-ink',
}

export function Chip({
  children,
  variant,
  onClick,
}: {
  children: ReactNode
  variant: ChipVariant
  onClick?: () => void
}) {
  const className = `inline-flex items-center gap-1.5 px-3 py-1.5 font-body font-bold text-[13px] ${variantClasses[variant]}`

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={className}>
        {children}
      </button>
    )
  }

  return <span className={className}>{children}</span>
}
