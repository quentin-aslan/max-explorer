<template>
  <div
      ref="mapElement"
      style="height: calc(100vh); width:100%;"
  />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useGoogleMaps } from '~/composables/use-google-maps'
import type {City, MapsFrame} from "~/types";

type Props = {
  cities: City[]
}

const props = defineProps<Props>()
const citySelected = defineModel('citySelected')

const {
  mapElement,
  loadMap,
  addCityMarker,
  map,
  clearMarkers,
  highlightCityMarker,
  clearHighlightedCityMarker
} = useGoogleMaps()

onMounted(async () => {
  if (mapElement.value) {
    await loadMap(mapElement.value, {
      lat: 46.603354,
      lng: 1.888334
    }, 6.2)
    addCitiesOnMap()
    // Create the DIV to hold the control.
    const centerControlDiv = document.createElement('div')
    // Create the control.
    const centerControl = createResearchControl(map.value)
    // Append the control to the DIV.
    centerControlDiv.appendChild(centerControl)

    map.value?.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(centerControlDiv)
  }
})

const addCitiesOnMap = () => {
  if (map.value) {
    clearMarkers()
    for (const city of props.cities) {
      const marker = addCityMarker(city)

      marker?.addListener('click', () => {
        citySelected.value = city
      })
    }
  }
}

const createResearchControl = (map) => {
  const controlButton = document.createElement('button')

  // Set CSS for the control.
  controlButton.style.backgroundColor = '#fff'
  controlButton.style.border = '2px solid #fff'
  controlButton.style.borderRadius = '3px'
  controlButton.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)'
  controlButton.style.color = 'rgb(25,25,25)'
  controlButton.style.cursor = 'pointer'
  controlButton.style.fontFamily = 'Roboto,Arial,sans-serif'
  controlButton.style.fontSize = '16px'
  controlButton.style.lineHeight = '38px'
  controlButton.style.margin = '8px 0 22px'
  controlButton.style.padding = '0 5px'
  controlButton.style.textAlign = 'center'

  controlButton.textContent = 'Search Map'
  controlButton.title = 'Click to recenter the map'
  controlButton.type = 'button'

  // Setup the click event listeners: simply set the map to Chicago.
  controlButton.addEventListener('click', () => {
    const bounds = map.getBounds()
    if (bounds) {
      const ne = bounds.getNorthEast() // LatLng of the northeast corner
      const sw = bounds.getSouthWest() // LatLng of the southwest corner
      const mapFrame: MapsFrame = {
        minLatitude: sw.lat(),
        minLongitude: sw.lng(),
        maxLatitude: ne.lat(),
        maxLongitude: ne.lng(),
      }
      emits('search-city', mapFrame)
    }
  })

  return controlButton
}

watch(() => props.cities, addCitiesOnMap)

defineExpose({
  highlightCityMarker,
  clearHighlightedCityMarker,
})
</script>
