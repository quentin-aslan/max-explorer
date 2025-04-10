import { ref } from 'vue'
import type { Map, Marker } from 'leaflet'
import L, { Icon } from 'leaflet'
import type { RoundTripDestination } from '~/types/common'

export const useLeaflet = () => {
  const mapElement = ref<HTMLDivElement | null>(null)
  const map = ref<Map | null>(null)
  const markers = ref<{ marker: Marker, city: RoundTripDestination }[]>([])

  // Initialize the map
  const initializeMap = (element: HTMLDivElement, center: { lat: number, lng: number }, zoom: number) => {
    map.value = L.map(element, {
      center: [center.lat, center.lng],
      zoom,
      zoomControl: true,
      attributionControl: false, // Removes default attribution text
    })

    // Use OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors',
    }).addTo(map.value)
  }

  // Add city marker with custom content
  const addCityMarker = (city: RoundTripDestination) => {
    if (!map.value || !city.latitude || !city.longitude) return null

    const marker = L.marker([city.latitude, city.longitude], {
      icon: L.divIcon({
        className: 'custom-city-marker',
        html: _getCityMarkerContent(city.destinationName),
        iconSize: [24, 24], // Adjust marker size
        iconAnchor: [12, 12], // Center the marker
      }),
    }).addTo(map.value)

    markers.value.push({ marker, city })
    return marker
  }

  // Get city marker HTML content
  const _getCityMarkerContent = (destinationName: string) => {
    return `
    <div class="marker-dot-wrapper">
      <div class="marker-dot"></div>
    </div>
  `
  }

  // Get highlighted city marker HTML content
  const _getHighlightedCityMarkerContent = (destinationName: string) => {
    return `
      <div class="bg-max-special text-white p-1 font-bold border-2 border-white rounded-lg shadow-md cursor-pointer">
        <span class="text-[1rem]">${destinationName}</span>
      </div>
    `
  }

  // Highlight a city marker
  const highlightCityMarker = (city: RoundTripDestination) => {
    const markerData = markers.value.find(({ city: cityItem }) => cityItem.destinationName === city.destinationName)
    if (!markerData) return

    markerData.marker.setIcon(L.divIcon({
      className: 'custom-highlighted-city-marker',
      html: _getHighlightedCityMarkerContent(markerData.city.destinationName),
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    }))
  }

  // Clear the highlight from a city marker
  const clearHighlightedCityMarker = (city: RoundTripDestination) => {
    const markerData = markers.value.find(({ city: cityItem }) => cityItem.destinationName === city.destinationName)
    if (!markerData) return

    markerData.marker.setIcon(L.divIcon({
      className: 'custom-city-marker',
      html: _getCityMarkerContent(markerData.city.destinationName),
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    }))
  }

  // Clear all markers
  const clearMarkers = () => {
    for (const { marker } of markers.value) {
      map.value?.removeLayer(marker)
    }
    markers.value = []
  }

  return {
    mapElement,
    initializeMap,
    addCityMarker,
    highlightCityMarker,
    clearHighlightedCityMarker,
    clearMarkers,
    map,
    markers,
  }
}
