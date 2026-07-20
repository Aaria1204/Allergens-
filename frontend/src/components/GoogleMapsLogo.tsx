import mapslogo from '../assets/icons/mapslogo.svg'

export function GoogleMapsLogo({ className }: { className?: string }) {
  return <img src={mapslogo} alt="Google Maps" className={className} />
}
