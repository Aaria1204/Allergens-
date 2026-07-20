import { useId } from 'react'
import type { DishStatus } from '../lib/dishStatus'

// Extracted from frontend/src/assets/icons/Safety status icon.svg, a Figma
// frame stacking all 3 badges (safe / uncertain / unsafe) at fixed y-offsets
// in one 67x161 frame. Path/rect data kept verbatim — only the viewBox
// changes per badge to crop to its own region.

function SafeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="20.5 20.5 26 26" xmlns="http://www.w3.org/2000/svg">
      <rect x="20.5" y="20.5" width="26" height="26" rx="4.5" fill="#477C5C" />
      <rect x="20.5" y="20.5" width="26" height="26" rx="4.5" fill="none" stroke="#16452A" />
      <path
        d="M37.4997 30.5L32.0002 35.9996L29.5005 33.4998"
        stroke="#F5EDE4"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}

function UncertainIcon({ className }: { className?: string }) {
  const clipId = useId()
  return (
    <svg className={className} viewBox="20.5 67.5 26 26" xmlns="http://www.w3.org/2000/svg">
      <rect x="20.5" y="67.5" width="26" height="26" rx="4.5" fill="#E2AB43" />
      <rect x="20.5" y="67.5" width="26" height="26" rx="4.5" fill="none" stroke="#D78D00" />
      <g clipPath={`url(#${clipId})`}>
        <path
          d="M32.7273 82.9474V82.7784C32.7306 82.1984 32.782 81.736 32.8814 81.3913C32.9841 81.0466 33.1333 80.7682 33.3288 80.5561C33.5244 80.344 33.7597 80.1518 34.0348 79.9794C34.2403 79.8468 34.4242 79.7093 34.5866 79.5668C34.7491 79.4242 34.8783 79.2668 34.9744 79.0945C35.0705 78.9188 35.1186 78.7232 35.1186 78.5078C35.1186 78.2791 35.0639 78.0786 34.9545 77.9062C34.8452 77.7339 34.6977 77.6013 34.5121 77.5085C34.3298 77.4157 34.1276 77.3693 33.9055 77.3693C33.6901 77.3693 33.4863 77.4174 33.294 77.5135C33.1018 77.6063 32.9444 77.7455 32.8217 77.9311C32.6991 78.1134 32.6328 78.3404 32.6229 78.6122H30.5945C30.611 77.9493 30.7701 77.4025 31.0717 76.9716C31.3733 76.5374 31.7727 76.2143 32.2699 76.0021C32.767 75.7867 33.3156 75.679 33.9155 75.679C34.575 75.679 35.1584 75.7884 35.6655 76.0071C36.1726 76.2225 36.5703 76.5357 36.8587 76.9467C37.147 77.3577 37.2912 77.8532 37.2912 78.4332C37.2912 78.821 37.2266 79.1657 37.0973 79.4673C36.9714 79.7656 36.794 80.0308 36.5653 80.2628C36.3366 80.4915 36.0665 80.6986 35.755 80.8842C35.4931 81.04 35.2777 81.2024 35.1087 81.3714C34.9429 81.5405 34.8187 81.736 34.7358 81.9581C34.6563 82.1802 34.6148 82.4536 34.6115 82.7784V82.9474H32.7273ZM33.7116 86.1293C33.3802 86.1293 33.0968 86.0133 32.8615 85.7812C32.6295 85.5459 32.5152 85.2642 32.5185 84.9361C32.5152 84.6113 32.6295 84.3329 32.8615 84.1009C33.0968 83.8688 33.3802 83.7528 33.7116 83.7528C34.0265 83.7528 34.3033 83.8688 34.5419 84.1009C34.7805 84.3329 34.9015 84.6113 34.9048 84.9361C34.9015 85.1548 34.8435 85.3554 34.7308 85.5376C34.6214 85.7166 34.4773 85.8608 34.2983 85.9702C34.1193 86.0762 33.9238 86.1293 33.7116 86.1293Z"
          fill="#F5EDE4"
        />
      </g>
      <defs>
        <clipPath id={clipId}>
          <rect width="12" height="12" fill="white" transform="translate(27.5 74.5)" />
        </clipPath>
      </defs>
    </svg>
  )
}

function UnsafeIcon({ className }: { className?: string }) {
  const clipId = useId()
  return (
    <svg className={className} viewBox="20.5 114.5 26 26" xmlns="http://www.w3.org/2000/svg">
      <rect x="20.5" y="114.5" width="26" height="26" rx="4.5" fill="#BF6D48" />
      <rect x="20.5" y="114.5" width="26" height="26" rx="4.5" fill="none" stroke="#C33E00" />
      <g clipPath={`url(#${clipId})`}>
        <path
          d="M34.6062 122.818L34.4123 129.947H32.5927L32.3938 122.818H34.6062ZM33.5025 133.129C33.1744 133.129 32.8926 133.013 32.6573 132.781C32.422 132.546 32.306 132.264 32.3093 131.936C32.306 131.611 32.422 131.333 32.6573 131.101C32.8926 130.869 33.1744 130.753 33.5025 130.753C33.8174 130.753 34.0941 130.869 34.3327 131.101C34.5714 131.333 34.6924 131.611 34.6957 131.936C34.6924 132.155 34.6344 132.355 34.5217 132.538C34.4123 132.717 34.2681 132.861 34.0891 132.97C33.9102 133.076 33.7146 133.129 33.5025 133.129Z"
          fill="#F5EDE4"
        />
      </g>
      <defs>
        <clipPath id={clipId}>
          <rect width="12" height="12" fill="white" transform="translate(27.5 121.5)" />
        </clipPath>
      </defs>
    </svg>
  )
}

const ICONS: Record<DishStatus, (props: { className?: string }) => React.JSX.Element> = {
  safe: SafeIcon,
  uncertain: UncertainIcon,
  unsafe: UnsafeIcon,
}

export function DishStatusIcon({ status, className }: { status: DishStatus; className?: string }) {
  const Icon = ICONS[status]
  return <Icon className={className} />
}
