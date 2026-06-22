'use client'

import { useEffect, useRef, useState } from 'react'
import { MapPin, Navigation, Locate } from 'lucide-react'

interface MapMarker {
  id: string
  lat: number
  lng: number
  title: string
  subtitle?: string
  type?: 'turf' | 'player' | 'user'
}

interface MapViewProps {
  center?: { lat: number; lng: number }
  zoom?: number
  markers?: MapMarker[]
  className?: string
  showUserLocation?: boolean
  onMarkerClick?: (marker: MapMarker) => void
}

export function MapView({
  center = { lat: 12.9352, lng: 77.6245 },
  zoom = 13,
  markers = [],
  className = '',
  showUserLocation = true,
  onMarkerClick,
}: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)

  // Load Leaflet dynamically (client-side only)
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Add Leaflet CSS
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link')
      link.id = 'leaflet-css'
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)
    }

    // Load Leaflet JS
    const loadLeaflet = async () => {
      const L = (await import('leaflet')).default

      if (!mapRef.current || mapInstanceRef.current) return

      // Initialize map
      const map = L.map(mapRef.current).setView([center.lat, center.lng], zoom)

      // OpenStreetMap tiles (free, no API key)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map)

      // Add markers
      markers.forEach((marker) => {
        const icon = L.divIcon({
          className: 'custom-marker',
          html: `<div class="flex items-center justify-center w-8 h-8 rounded-full ${
            marker.type === 'turf'
              ? 'bg-primary text-primary-foreground'
              : marker.type === 'player'
                ? 'bg-secondary text-white'
                : 'bg-accent text-white'
          } shadow-lg border-2 border-white text-xs font-bold">${
            marker.type === 'turf' ? '⚽' : marker.type === 'player' ? '👤' : '📍'
          }</div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 32],
        })

        const m = L.marker([marker.lat, marker.lng], { icon }).addTo(map)
        m.bindPopup(`<b>${marker.title}</b>${marker.subtitle ? `<br/>${marker.subtitle}` : ''}`)

        if (onMarkerClick) {
          m.on('click', () => onMarkerClick(marker))
        }
      })

      // Get user location
      if (showUserLocation && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const userLat = pos.coords.latitude
            const userLng = pos.coords.longitude
            setUserLocation({ lat: userLat, lng: userLng })

            const userIcon = L.divIcon({
              className: 'user-marker',
              html: '<div class="w-4 h-4 bg-blue-500 rounded-full border-3 border-white shadow-lg animate-pulse"></div>',
              iconSize: [16, 16],
              iconAnchor: [8, 8],
            })

            L.marker([userLat, userLng], { icon: userIcon })
              .addTo(map)
              .bindPopup('You are here')

            // Add accuracy circle
            L.circle([userLat, userLng], {
              radius: pos.coords.accuracy,
              color: '#3b82f6',
              fillColor: '#3b82f6',
              fillOpacity: 0.1,
              weight: 1,
            }).addTo(map)
          },
          () => {} // Silently fail if permission denied
        )
      }

      mapInstanceRef.current = map
      setIsLoaded(true)
    }

    loadLeaflet()

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [center.lat, center.lng, zoom, markers, showUserLocation, onMarkerClick])

  return (
    <div className={`relative rounded-[20px] overflow-hidden border border-border ${className}`}>
      <div ref={mapRef} className="w-full h-full min-h-[250px] sm:min-h-[300px] z-0" />

      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-surface-2">
          <div className="flex flex-col items-center gap-2">
            <MapPin className="size-8 text-muted-foreground animate-bounce" />
            <p className="text-sm text-muted-foreground">Loading map...</p>
          </div>
        </div>
      )}

      {/* Map controls */}
      <div className="absolute top-3 right-3 z-[1000] flex flex-col gap-2">
        {userLocation && (
          <button
            onClick={() => {
              if (mapInstanceRef.current && userLocation) {
                mapInstanceRef.current.setView([userLocation.lat, userLocation.lng], 15)
              }
            }}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-surface-2/90 backdrop-blur border border-border shadow-lg hover:bg-surface-2 transition-colors"
            aria-label="Center on my location"
          >
            <Locate className="size-4 text-primary" />
          </button>
        )}
      </div>
    </div>
  )
}
