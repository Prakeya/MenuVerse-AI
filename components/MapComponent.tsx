'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'

let DefaultIcon: L.Icon | undefined

const getDefaultIcon = () => {
  if (typeof window === 'undefined') return undefined
  if (DefaultIcon) return DefaultIcon
  DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  })
  return DefaultIcon
}

interface Restaurant {
  id: string
  name: string
  latitude: number
  longitude: number
  rating: number
  signature_dish_name?: string
}

interface MapComponentProps {
  center: [number, number]
  restaurants: Restaurant[]
  showHotels: boolean
  onRestaurantClick: (id: string) => void
}

export default function MapComponent({ center, restaurants, showHotels, onRestaurantClick }: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    const icon = getDefaultIcon()
    if (icon) L.Marker.prototype.options.icon = icon

    const map = L.map(mapRef.current, {
      center,
      zoom: 14,
      zoomControl: true,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map)

    mapInstanceRef.current = map

    return () => {
      map.remove()
      mapInstanceRef.current = null
    }
  }, [center])

  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map) return

    // Clear existing layers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.CircleMarker) {
        map.removeLayer(layer)
      }
    })

    // Add restaurant markers
    restaurants.forEach((r) => {
      const marker = L.marker([r.latitude, r.longitude])
        .addTo(map)
        .bindPopup(
          `<div style="font-family: system-ui, sans-serif; min-width: 200px;">
            <h3 style="margin: 0 0 8px; font-size: 16px; font-weight: 700;">${r.name}</h3>
            <div style="font-size: 13px; color: #666; margin-bottom: 8px;">⭐ ${r.rating}</div>
            ${r.signature_dish_name ? `<div style="font-size: 12px; color: #888; margin-bottom: 12px;">Signature: ${r.signature_dish_name}</div>` : ''}
            <button onclick="window.dispatchEvent(new CustomEvent('restaurant-click', { detail: '${r.id}' }))" style="background: #111; color: white; border: none; padding: 8px 16px; border-radius: 999px; font-size: 12px; font-weight: 600; cursor: pointer; width: 100%;">View Menu</button>
          </div>`
        )
        .on('click', () => {
          marker.openPopup()
        })

      // Listen for popup button clicks
      const handler = (e: Event) => {
        const customEvent = e as CustomEvent<{ detail: string }>
        onRestaurantClick(customEvent.detail.detail)
      }
      window.addEventListener('restaurant-click', handler as EventListener)
      
      // Store handler for cleanup
      marker.on('remove', () => {
        window.removeEventListener('restaurant-click', handler as EventListener)
      })
    })

    // Add hotel markers if enabled
    if (showHotels) {
      const hotelIcon = L.divIcon({
        className: 'hotel-marker',
        html: '<div style="background: #F5A623; color: #111; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; box-shadow: 0 2px 8px rgba(0,0,0,0.3); border: 2px solid white;">H</div>',
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      })

      // Simulate hotels around center
      for (let i = 0; i < 3; i++) {
        const lat = center[0] + (Math.random() - 0.5) * 0.01
        const lng = center[1] + (Math.random() - 0.5) * 0.01
        L.marker([lat, lng], { icon: hotelIcon })
          .addTo(map)
          .bindPopup(`<div style="font-family: system-ui, sans-serif;"><strong>Hotel</strong><br/><span style="font-size: 12px; color: #666;">Nearby accommodation</span></div>`)
      }
    }
  }, [restaurants, showHotels, center, onRestaurantClick])

  return <div ref={mapRef} style={{ height: '500px', width: '100%', borderRadius: '20px', border: '1px solid #e5e7eb', overflow: 'hidden' }} />
}