'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useI18n } from '../../lib/contexts'
import { MapPin, Globe, ChevronDown, Search, Star, Clock, Navigation } from 'lucide-react'
import { Restaurant } from '../../lib/types'
import BackButton from '../../components/BackButton'
import ImageWithFallback from '../../components/ImageWithFallback'

const CITIES = ['New York', 'Los Angeles', 'Chicago', 'Miami', 'San Francisco', 'Austin']

const RESTAURANTS: Restaurant[] = [
  { id: 'r1', name: 'The Golden Fork', cuisine_type: 'Indian', cover_image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80', rating: 4.8, distance_km: 0.8, address: '123 Main St', hours: '11:00 AM - 10:00 PM', signature_dish_name: 'Butter Chicken', latitude: 40.7128, longitude: -74.0060 },
  { id: 'r2', name: 'Bella Italia', cuisine_type: 'Italian', cover_image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80', rating: 4.6, distance_km: 1.2, address: '456 Oak Ave', hours: '12:00 PM - 11:00 PM', signature_dish_name: 'Margherita Pizza', latitude: 40.7138, longitude: -74.0070 },
  { id: 'r3', name: 'Sakura Sushi', cuisine_type: 'Japanese', cover_image: 'https://images.unsplash.com/photo-1579027989536-b7b1f875659b?auto=format&fit=crop&w=600&q=80', rating: 4.9, distance_km: 2.1, address: '789 Pine Rd', hours: '11:30 AM - 10:30 PM', signature_dish_name: 'Sushi Platter', latitude: 40.7148, longitude: -74.0080 },
  { id: 'r4', name: 'Burger Republic', cuisine_type: 'American', cover_image: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=600&q=80', rating: 4.5, distance_km: 0.5, address: '321 Elm St', hours: '10:00 AM - 11:00 PM', signature_dish_name: 'Truffle Burger', latitude: 40.7118, longitude: -74.0050 },
]

const CITY_COORDS: Record<string, [number, number]> = {
  'New York': [40.7128, -74.0060],
  'Los Angeles': [34.0522, -118.2437],
  'Chicago': [41.8781, -87.6298],
  'Miami': [25.7617, -80.1918],
  'San Francisco': [37.7749, -122.4194],
  'Austin': [30.2672, -97.7431],
}

export default function DiscoveryPage() {
  const router = useRouter()
  const { t, lang, setLang } = useI18n()
  const [place, setPlace] = useState('New York')
  const [showPlaceMenu, setShowPlaceMenu] = useState(false)
  const [showLang, setShowLang] = useState(false)
  const [showHotels, setShowHotels] = useState(false)
  const [cuisineFilter, setCuisineFilter] = useState<string | null>(null)

  const cuisines = Array.from(new Set(RESTAURANTS.map(r => r.cuisine_type)))
  const filtered = cuisineFilter ? RESTAURANTS.filter(r => r.cuisine_type === cuisineFilter) : RESTAURANTS
  const center = CITY_COORDS[place] || [40.7128, -74.0060]

  const [MapComponent, setMapComponent] = useState<any>(null)

  useEffect(() => {
    import('../../components/MapComponent').then(mod => setMapComponent(() => mod.default))
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#FFFEFB' }}>
      {/* Header — place + language only */}
      <header style={{ position: 'sticky', top: 0, zIndex: 30, background: 'rgba(255,254,251,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <BackButton fallback="/diner-choice" />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }} onClick={() => router.push('/diner-choice')} role="button">
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#F5A623', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 12, color: '#111' }}>M</div>
              <span style={{ fontWeight: 600, fontSize: 14, color: '#1a1a1a' }}>MenuVerse AI</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Place selector */}
            <div style={{ position: 'relative' }}>
              <button onClick={() => setShowPlaceMenu(!showPlaceMenu)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 999, border: '1px solid #e5e7eb', background: 'white', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>
                <MapPin size={16} /> {place} <ChevronDown size={14} />
              </button>
              {showPlaceMenu && (
                <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: 8, background: 'white', borderRadius: 16, boxShadow: '0 12px 32px rgba(0,0,0,0.1)', padding: 8, minWidth: 220, zIndex: 20 }}>
                  <div style={{ padding: '8px 12px', borderBottom: '1px solid #f3f4f6', marginBottom: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', background: '#f9fafb', borderRadius: 8, fontSize: 12, color: '#6b7280' }}>
                      <Search size={14} /> Search city...
                    </div>
                  </div>
                  {CITIES.map(c => (
                    <button key={c} onClick={() => { setPlace(c); setShowPlaceMenu(false) }} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '8px 12px', borderRadius: 8, border: 'none', background: place === c ? '#f5f5f5' : 'transparent', cursor: 'pointer', fontSize: 13, color: '#1a1a1a' }}>
                      {c} {place === c && '✓'}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* Language selector */}
            <div style={{ position: 'relative', zIndex: 9999 }}>
              <button onClick={() => setShowLang(!showLang)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 999, border: '1px solid #e5e7eb', background: 'white', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#1a1a1a', position: 'relative', zIndex: 9999 }}>
                <Globe size={16} /> {lang.toUpperCase()} <ChevronDown size={14} />
              </button>
              {showLang && (
                <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, background: 'white', borderRadius: 16, boxShadow: '0 12px 32px rgba(0,0,0,0.2)', padding: 8, minWidth: 180, zIndex: 9999, pointerEvents: 'auto' }}>
                  {['en', 'es', 'fr', 'hi', 'ar', 'zh'].map(l => (
                    <button key={l} onClick={(e) => { e.stopPropagation(); setLang(l); setShowLang(false) }} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '10px 14px', borderRadius: 8, border: 'none', background: lang === l ? '#f5f5f5' : 'transparent', cursor: 'pointer', fontSize: 14, color: '#1a1a1a', pointerEvents: 'auto' }}>
                      {l.toUpperCase()} {lang === l && '✓'}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#1a1a1a', margin: '0 0 4px' }}>{t('Browse Restaurants Near Me')}</h1>
          <p style={{ fontSize: 14, color: '#6b7280', margin: 0 }}>{filtered.length} {t('item(s)')}</p>
        </div>

        {/* Cuisine filters */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, overflowX: 'auto' }} className="scrollbar-hide">
          <button onClick={() => setCuisineFilter(null)} style={{ padding: '8px 18px', borderRadius: 999, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', fontSize: 13, fontWeight: 600, background: !cuisineFilter ? '#111' : '#f3f4f6', color: !cuisineFilter ? 'white' : '#1a1a1a' }}>{t('All Dishes')}</button>
          {cuisines.map(c => (
            <button key={c} onClick={() => setCuisineFilter(c)} style={{ padding: '8px 18px', borderRadius: 999, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', fontSize: 13, fontWeight: 600, background: cuisineFilter === c ? '#111' : '#f3f4f6', color: cuisineFilter === c ? 'white' : '#1a1a1a' }}>{t(c)}</button>
          ))}
        </div>

        {/* Real Leaflet Map */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Navigation size={16} /> {t('Map View')}
            </div>
            <button onClick={() => setShowHotels(!showHotels)} style={{ padding: '8px 16px', borderRadius: 999, border: showHotels ? 'none' : '1px solid #e5e7eb', background: showHotels ? '#111' : 'white', color: showHotels ? 'white' : '#1a1a1a', cursor: 'pointer', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
              <MapPin size={14} /> {showHotels ? t('Hide') : t('View')} {t('Browse Restaurants Near Me')}
            </button>
          </div>
          {MapComponent && (
            <MapComponent
            center={center}
            restaurants={filtered.map(r => ({ id: r.id, name: r.name, latitude: r.latitude, longitude: r.longitude, rating: r.rating, signature_dish_name: r.signature_dish_name }))}
            showHotels={showHotels}
              onRestaurantClick={(id: string) => router.push(`/menu/${id}`)}
            />
          )}
        </div>

        {/* Restaurant cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
          {filtered.map(r => (
            <div key={r.id} onClick={() => router.push(`/menu/${r.id}`)} style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 20, overflow: 'hidden', cursor: 'pointer', transition: 'all 0.2s' }}>
              <div style={{ position: 'relative', height: 180 }}>
                <ImageWithFallback src={r.cover_image} alt={r.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', top: 12, right: 12, background: 'white', borderRadius: 999, padding: '4px 10px', fontSize: 12, fontWeight: 700, color: '#1a1a1a', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Star size={12} style={{ color: '#F5A623' }} /> {r.rating}
                </div>
              </div>
              <div style={{ padding: 16 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', margin: '0 0 4px' }}>{r.name}</h3>
                <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Clock size={12} /> {r.hours}
                </div>
                {r.signature_dish_name && (
                  <div style={{ background: '#f9fafb', borderRadius: 10, padding: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 8, background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ fontSize: 9, color: '#6b7280' }}>DISH</div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: '#F5A623', letterSpacing: '0.05em', marginBottom: 2 }}>{t('SIGNATURE DISH')}</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>{r.signature_dish_name}</div>
                    </div>
                  </div>
                )}
                <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                   <span style={{ fontSize: 12, color: '#6b7280' }}>{r.distance_km} {t('km away')}</span>
                  <span style={{ padding: '6px 14px', borderRadius: 999, background: '#111', color: 'white', fontSize: 12, fontWeight: 600 }}>{t('View Menu')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}