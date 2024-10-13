import { Loader } from '@googlemaps/js-api-loader'
import { ref } from 'vue'
import { useHtmlMarker } from '~/composables/use-html-marker'
import type { HTMLMapMarker } from '~/composables/use-html-marker'
import type { City } from "~/types";

export const useGoogleMaps = () => {
  const mapElement = ref<HTMLDivElement | null>(null)
  const map = ref<google.maps.Map | null>(null)
  const markers = ref<{ marker: HTMLMapMarker, city: City }[]>([])

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

  const _getCityMarkerContent = (city: City) => {
    return `
    <div class="z-10 p-1 text-black font-bold bg-white border border-black rounded-lg shadow-md cursor-pointer hover:bg-gray-900 hover:text-white">
        <span class="text-[1rem]">${city.name}</span>
    </div>
    `
  }

  const _getHighlightedCityMarkerContent = (city: City) => {
    return `
    <div class="bg-gray-900 text-white z-10 p-1 font-bold border border-black rounded-lg shadow-md cursor-pointer">
        <span class="text-[1rem]">${city.name}</span>
    </div>
    `
  }

  const addCityMarker = (city: City) => {
    if (!map.value) return

    const { createHTMLMapMarker } = useHtmlMarker()

    const positionLatLng = new google.maps.LatLng(city.latitude, city.longitude)

    const marker = createHTMLMapMarker({
      latlng: positionLatLng,
      map: map.value,
      html: _getCityMarkerContent(city),
    })

    markers.value.push({ marker, city })

    return marker
  }

  const highlightCityMarker = (cityId: number) => {
    const marker = markers.value.find(({ city: cityItem }) => cityItem.id === cityId)
    if (!marker) return

    marker.marker.updateDivHtml(_getHighlightedCityMarkerContent(marker.city))
  }

  const clearHighlightedCityMarker = (cityId: number) => {
    const marker = markers.value.find(({ city: cityItem }) => cityItem.id === cityId)
    if (!marker) return

    marker.marker.updateDivHtml(_getCityMarkerContent(marker.city))
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