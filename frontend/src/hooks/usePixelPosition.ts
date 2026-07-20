import { useEffect, useRef, useState } from 'react'

/**
 * Converts a lat/lng into pixel coordinates relative to the map's container
 * div, recomputing on pan/zoom. google.maps.Map has no public projection —
 * only an OverlayView does, so we mount an invisible one purely to borrow it.
 * The overlay must actually attach a node via onAdd() for its pane geometry
 * (and therefore its projection's div-pixel origin) to initialize correctly.
 */
export function usePixelPosition(
  map: google.maps.Map | null,
  position: google.maps.LatLngLiteral | null,
) {
  const [pixel, setPixel] = useState<{ x: number; y: number } | null>(null)
  const overlayRef = useRef<google.maps.OverlayView | null>(null)

  useEffect(() => {
    if (!map) return

    class ProjectionOverlay extends google.maps.OverlayView {
      private node = document.createElement('div')

      onAdd() {
        this.getPanes()?.overlayLayer.appendChild(this.node)
      }

      draw() {}

      onRemove() {
        this.node.remove()
      }
    }

    const overlay = new ProjectionOverlay()
    overlay.setMap(map)
    overlayRef.current = overlay

    return () => {
      overlay.setMap(null)
      overlayRef.current = null
    }
  }, [map])

  useEffect(() => {
    if (!map || !position) {
      setPixel(null)
      return
    }

    const update = () => {
      const projection = overlayRef.current?.getProjection()
      if (!projection) return
      const point = projection.fromLatLngToDivPixel(new google.maps.LatLng(position))
      if (!point) return

      // fromLatLngToDivPixel is documented as being relative to the map's
      // own div (top-left origin), but empirically it's relative to the
      // div's center in this setup — correct for that here.
      const container = map.getDiv()
      setPixel({
        x: point.x + container.clientWidth / 2,
        y: point.y + container.clientHeight / 2,
      })
    }

    update()
    const listeners = [
      map.addListener('bounds_changed', update),
      map.addListener('zoom_changed', update),
    ]
    // The overlay's projection may not be ready on the very first tick.
    const retryTimeout = setTimeout(update, 50)

    return () => {
      listeners.forEach((listener) => listener.remove())
      clearTimeout(retryTimeout)
    }
    // oxlint-disable-next-line react-hooks/exhaustive-deps -- intentionally
    // depend on lat/lng primitives, not the position object reference, so a
    // fresh-but-equal object doesn't trigger an unnecessary re-run.
  }, [map, position?.lat, position?.lng])

  return pixel
}
