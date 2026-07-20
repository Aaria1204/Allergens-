import { APIProvider, Map as GoogleMap, useMap } from '@vis.gl/react-google-maps'
import { MarkerClusterer, type Renderer } from '@googlemaps/markerclusterer'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { Restaurant } from '../api/restaurants'
import coordinates from '../data/coordinates.json'
import { usePixelPosition } from '../hooks/usePixelPosition'
import { buildClusterIcon, buildPinIcon } from '../lib/mapPinIcon'
import { MinusIcon, PlusIcon, RecenterIcon } from './icons'
import { RestaurantCard } from './RestaurantCard'

const SAINT_MARKS_CENTER = { lat: 40.7285, lng: -73.9865 }
const DEFAULT_ZOOM = 16

const MAP_STYLES: google.maps.MapTypeStyle[] = [
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
]

const coordinatesByName = new Map(coordinates.map((c) => [c.name, { lat: c.lat, lng: c.lng }]))

function MapControls() {
  const map = useMap()

  const handleRecenter = () => {
    map?.panTo(SAINT_MARKS_CENTER)
    map?.setZoom(DEFAULT_ZOOM)
  }

  const handleZoomIn = () => {
    if (!map) return
    map.setZoom((map.getZoom() ?? DEFAULT_ZOOM) + 1)
  }

  const handleZoomOut = () => {
    if (!map) return
    map.setZoom((map.getZoom() ?? DEFAULT_ZOOM) - 1)
  }

  return (
    <div className="absolute right-6 bottom-6 flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={handleRecenter}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-hairline bg-white text-ink shadow-md"
      >
        <RecenterIcon className="h-4 w-4" />
      </button>

      <div className="flex flex-col overflow-hidden rounded-lg border border-hairline bg-white shadow-md">
        <button
          type="button"
          onClick={handleZoomIn}
          className="flex h-10 w-10 items-center justify-center border-b border-hairline text-ink"
        >
          <PlusIcon className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={handleZoomOut}
          className="flex h-10 w-10 items-center justify-center text-ink"
        >
          <MinusIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

function toGoogleIcon(icon: ReturnType<typeof buildPinIcon>): google.maps.Icon {
  return {
    url: icon.url,
    scaledSize: new google.maps.Size(icon.size.width, icon.size.height),
    anchor: new google.maps.Point(icon.anchor.x, icon.anchor.y),
  }
}

const clusterRenderer: Renderer = {
  render: ({ count, position }) =>
    new google.maps.Marker({
      position,
      icon: toGoogleIcon(buildClusterIcon(count)),
      zIndex: 1000 + count,
    }),
}

function RestaurantMarkers({
  restaurants,
  selectedId,
  onSelect,
  onViewMenu,
}: {
  restaurants: Restaurant[]
  selectedId: number | null
  onSelect: (id: number | null) => void
  onViewMenu: (restaurant: Restaurant) => void
}) {
  const map = useMap()
  // The pin's colored/ringed "selected" look is driven by `selectedId`
  // (lifted to App so it survives "View menu" closing the card below). The
  // floating card itself has its own lifecycle — it should disappear once
  // "View menu" is clicked even though the pin stays selected.
  const [cardRestaurantId, setCardRestaurantId] = useState<number | null>(null)
  const hasFitBounds = useRef(false)
  const markersRef = useRef<Map<number, google.maps.Marker>>(new Map())

  const pins = useMemo(() => {
    return restaurants.flatMap((restaurant) => {
      const position = restaurant.name ? coordinatesByName.get(restaurant.name) : undefined
      if (!position) {
        console.warn(`No coordinates found for restaurant "${restaurant.name}" — skipping pin.`)
        return []
      }
      return [{ restaurant, position }]
    })
  }, [restaurants])

  useEffect(() => {
    if (!map || pins.length === 0) return

    const markers = pins.map(({ restaurant, position }) => {
      const marker = new google.maps.Marker({
        position,
        title: restaurant.name ?? undefined,
        icon: toGoogleIcon(buildPinIcon(restaurant.allergen_percentile)),
      })
      marker.addListener('click', () => {
        onSelect(restaurant.id)
        setCardRestaurantId(restaurant.id)
      })
      return marker
    })

    markersRef.current = new Map(pins.map(({ restaurant }, i) => [restaurant.id, markers[i]]))

    const clusterer = new MarkerClusterer({ map, markers, renderer: clusterRenderer })

    if (!hasFitBounds.current) {
      const bounds = new google.maps.LatLngBounds()
      pins.forEach(({ position }) => bounds.extend(position))
      map.fitBounds(bounds, 60)
      hasFitBounds.current = true
    }

    return () => {
      clusterer.clearMarkers()
      markers.forEach((marker) => marker.setMap(null))
      markersRef.current = new Map()
    }
  }, [map, pins, onSelect])

  // Re-style just the affected markers (selected pin gets its percentile
  // color + ring + ripple) without recreating the whole marker set.
  useEffect(() => {
    for (const { restaurant } of pins) {
      const marker = markersRef.current.get(restaurant.id)
      if (!marker) continue
      marker.setIcon(
        toGoogleIcon(
          buildPinIcon(restaurant.allergen_percentile, { selected: restaurant.id === selectedId }),
        ),
      )
      marker.setZIndex(restaurant.id === selectedId ? 999 : undefined)
    }
  }, [selectedId, pins])

  const cardRestaurant = pins.find((pin) => pin.restaurant.id === cardRestaurantId)
  const anchor = usePixelPosition(map, cardRestaurant?.position ?? null)

  return cardRestaurant ? (
    <RestaurantCard
      restaurant={cardRestaurant.restaurant}
      anchor={anchor}
      onClose={() => {
        onSelect(null)
        setCardRestaurantId(null)
      }}
      onViewMenu={() => {
        // Card goes away, but the pin stays visually selected — selectedId
        // (lifted to App) isn't touched here.
        setCardRestaurantId(null)
        onViewMenu(cardRestaurant.restaurant)
      }}
    />
  ) : null
}

function StatusBanner({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="absolute top-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-hairline bg-white px-4 py-2 shadow-md">
      <p className="font-body text-[13px] font-bold text-ink">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="font-body text-[13px] font-bold text-brand underline"
        >
          Retry
        </button>
      )}
    </div>
  )
}

export function MapView({
  restaurants,
  loading,
  error,
  onRetry,
  selectedId,
  onSelect,
  onViewMenu,
}: {
  restaurants: Restaurant[]
  loading: boolean
  error: string | null
  onRetry: () => void
  selectedId: number | null
  onSelect: (id: number | null) => void
  onViewMenu: (restaurant: Restaurant) => void
}) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

  if (!apiKey) {
    return (
      <div className="flex flex-1 items-center justify-center bg-map">
        <p className="font-body text-sm text-muted">
          Missing VITE_GOOGLE_MAPS_API_KEY — add it to frontend/.env.local
        </p>
      </div>
    )
  }

  return (
    <APIProvider apiKey={apiKey}>
      <div className="relative flex-1">
        <GoogleMap
          defaultCenter={SAINT_MARKS_CENTER}
          defaultZoom={DEFAULT_ZOOM}
          gestureHandling="greedy"
          disableDefaultUI
          clickableIcons={false}
          styles={MAP_STYLES}
          className="h-full w-full"
        >
          <RestaurantMarkers
            restaurants={restaurants}
            selectedId={selectedId}
            onSelect={onSelect}
            onViewMenu={onViewMenu}
          />
        </GoogleMap>

        {loading && <StatusBanner message="Waking up the kitchen… loading restaurants" />}
        {error && !loading && <StatusBanner message={error} onRetry={onRetry} />}

        <MapControls />
      </div>
    </APIProvider>
  )
}
