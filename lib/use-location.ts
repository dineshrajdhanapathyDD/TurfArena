'use client'

import { useState, useEffect, useCallback } from 'react'

export interface LocationData {
  latitude: number
  longitude: number
  accuracy: number
  timestamp: number
}

export interface UseLocationOptions {
  enableHighAccuracy?: boolean
  watchPosition?: boolean
  timeout?: number
  maximumAge?: number
}

export interface UseLocationReturn {
  location: LocationData | null
  error: string | null
  loading: boolean
  requestPermission: () => void
  isSupported: boolean
}

export function useLocation(options: UseLocationOptions = {}): UseLocationReturn {
  const {
    enableHighAccuracy = true,
    watchPosition = false,
    timeout = 10000,
    maximumAge = 30000,
  } = options

  const [location, setLocation] = useState<LocationData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const isSupported = typeof window !== 'undefined' && 'geolocation' in navigator

  const handleSuccess = useCallback((position: GeolocationPosition) => {
    setLocation({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      timestamp: position.timestamp,
    })
    setError(null)
    setLoading(false)
  }, [])

  const handleError = useCallback((err: GeolocationPositionError) => {
    switch (err.code) {
      case err.PERMISSION_DENIED:
        setError('Location permission denied. Please enable location access.')
        break
      case err.POSITION_UNAVAILABLE:
        setError('Location unavailable. Please check your GPS settings.')
        break
      case err.TIMEOUT:
        setError('Location request timed out. Please try again.')
        break
      default:
        setError('Failed to get location.')
    }
    setLoading(false)
  }, [])

  const requestPermission = useCallback(() => {
    if (!isSupported) {
      setError('Geolocation is not supported by this browser.')
      return
    }

    setLoading(true)
    setError(null)

    const geoOptions: PositionOptions = {
      enableHighAccuracy,
      timeout,
      maximumAge,
    }

    if (watchPosition) {
      const watchId = navigator.geolocation.watchPosition(handleSuccess, handleError, geoOptions)
      return () => navigator.geolocation.clearWatch(watchId)
    } else {
      navigator.geolocation.getCurrentPosition(handleSuccess, handleError, geoOptions)
    }
  }, [isSupported, enableHighAccuracy, timeout, maximumAge, watchPosition, handleSuccess, handleError])

  // Auto-request if watchPosition is enabled
  useEffect(() => {
    if (watchPosition && isSupported) {
      const geoOptions: PositionOptions = {
        enableHighAccuracy,
        timeout,
        maximumAge,
      }
      const watchId = navigator.geolocation.watchPosition(handleSuccess, handleError, geoOptions)
      return () => navigator.geolocation.clearWatch(watchId)
    }
  }, [watchPosition, isSupported, enableHighAccuracy, timeout, maximumAge, handleSuccess, handleError])

  return {
    location,
    error,
    loading,
    requestPermission,
    isSupported,
  }
}

// ─── Helper: Send location to backend ─────────────────────
export async function sendLiveLocation(userId: string, matchId: string, lat: number, lng: number, accuracy: number) {
  const res = await fetch('/api/location/live', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, matchId, lat, lng, accuracy }),
  })
  return res.json()
}

export async function checkInAtVenue(userId: string, matchId: string, lat: number, lng: number) {
  const res = await fetch('/api/location/checkin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, matchId, lat, lng }),
  })
  return res.json()
}

export async function fetchNearbyTurfs(lat: number, lng: number, radius = 10, sport?: string) {
  const params = new URLSearchParams({ lat: String(lat), lng: String(lng), radius: String(radius) })
  if (sport) params.append('sport', sport)
  const res = await fetch(`/api/location/nearby-turfs?${params}`)
  return res.json()
}
