import { Loader } from '@googlemaps/js-api-loader'
import { ref } from 'vue'
import { useHtmlMarker } from '~/composables/use-html-marker'
import type { HTMLMapMarker } from '~/composables/use-html-marker'
import type { RoundTripDestination } from '~/types/common'

export const useGoogleMaps = () => {
  const mapElement = ref<HTMLDivElement | null>(null)
  const map = ref<google.maps.Map | null>(null)
  const markers = ref<{ marker: HTMLMapMarker, city: RoundTripDestination }[]>([])

  const loadMap = async (element: HTMLDivElement, center: google.maps.LatLngLiteral, zoom: number) => {
    const loader = new Loader({
      apiKey: useRuntimeConfig().public.GOOGLE_API_KEY,
      version: 'weekly',
    })

    await loader.load()
    map.value = new google.maps.Map(element, {
      center,
      zoom,
      clickableIcons: false, // Disable clickable icons by default
      disableDefaultUI: false, // Disable all default UI controls
      zoomControl: true, // Show only the zoom control
      mapTypeControl: false, // Disable the map type control
      scaleControl: false, // Disable the scale control
      streetViewControl: false, // Disable the Street View control
      rotateControl: false, // Disable the rotate control
      fullscreenControl: true, // Disable the fullscreen control
      styles: [ // Customize the map
        {
          featureType: 'poi',
          stylers: [{ visibility: 'off' }], // Hide points of interest
        },
        {
          featureType: 'transit',
          stylers: [{ visibility: 'off' }], // Hide transit elements
        },
      ],
    })

    // A div is placed above the map and prevents interaction with it. The only way I found to remove it:
    map.value.addListener('tilesloaded', () => {
      const overlayDiv: HTMLDivElement | null = element.querySelector('div[style*="z-index: 3"]')
      if (overlayDiv) {
        overlayDiv.style.pointerEvents = 'none'
        overlayDiv.style.zIndex = '1' // Ajustez selon vos besoins
      }
    })
  }

  const _getCityMarkerContent = (destinationName: string) => {
    return `
    <div class="z-10 bg-max-action rounded-full">
      <div class="w-4 h-4 border-2 border-white rounded-full shadow-[0_3px_6px_rgba(25,32,36,0.16),0_-1px_4px_rgba(25,32,36,0.04)]"></div>
    </div>
    `
  }

  const _getHighlightedCityMarkerContent = (destinationName: string) => {
    return `

    <div class="bg-max-special text-white p-1 font-bold border-2 border-white rounded-lg shadow-md cursor-pointer">
        <span class="text-[1rem]">${destinationName}</span>
    </div>
    `
  }

  const addCityMarker = (city: RoundTripDestination) => {
    if (!map.value) return

    const { createHTMLMapMarker } = useHtmlMarker()

    const positionLatLng = new google.maps.LatLng(city.latitude, city.longitude)

    const marker = createHTMLMapMarker({
      latlng: positionLatLng,
      map: map.value,
      html: _getCityMarkerContent(city),
    })
    markers.value.push({ marker, city: city.destinationName })
    return marker
  }

  const highlightCityMarker = (city: RoundTripDestination) => {
    const marker = markers.value.find(({ city: cityItem }) => cityItem === city.destinationName)
    if (!marker) return

    marker.marker.updateDivHtml(_getHighlightedCityMarkerContent(marker.city), { zIndex: 10 })
  }

  const clearHighlightedCityMarker = (city: RoundTripDestination) => {
    const marker = markers.value.find(({ city: cityItem }) => cityItem === city.destinationName)
    if (!marker) return

    marker.marker.updateDivHtml(_getCityMarkerContent(marker.city), { zIndex: 0 })
  }

  const clearMarkers = () => {
    for (const { marker } of markers.value) {
      marker.remove()
    }

    markers.value = []
  }

  const updateCenterView = (center: google.maps.LatLngLiteral) => {
    if (!map.value) return

    map.value.setCenter(center)
  }

  return {
    mapElement,
    loadMap,
    addCityMarker,
    highlightCityMarker,
    clearHighlightedCityMarker,
    clearMarkers,
    updateCenterView,
    map,
    markers,
  }
}
