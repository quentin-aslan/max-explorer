<template>
  <div
    ref="mapElement"
    class="lg:border lg:border-max-sec lg:rounded-3xl"
    style="height: calc(100vh); width: 100%"
  />
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useLeaflet } from '~/composables/use-leaflet'
import type { TripViewModel } from '~/domains/trips/entities/trip.view-model'

type Props = {
  destinations: TripViewModel[]
  departureCity?: unknown
}

const props = defineProps<Props>()
const citySelected = defineModel()

// Import functions from the composable
const {
  mapElement,
  initializeMap,
  addCityMarker,
  clearMarkers,
  highlightCityMarker,
  clearHighlightedCityMarker,
} = useLeaflet()

// Add cities to the map
const addCitiesOnMap = () => {
  clearMarkers()
  for (const city of props.destinations) {
    const marker = addCityMarker(city)

    if (marker) {
      marker.on('click', () => {
        citySelected.value = city
      })
    }

    /* marker.on('mouseover', () => {
      const oldCitySelected = citySelected.value
      citySelected.value = city
      onCitySelectedChanges(city, oldCitySelected)
    }) */
  }
}

// Handle marker highlight changes
const onCitySelectedChanges = (newCitySelected: TripViewModel, oldCitySelected: TripViewModel) => {
  if (oldCitySelected) {
    clearHighlightedCityMarker(oldCitySelected)
  }

  if (newCitySelected) {
    highlightCityMarker(newCitySelected)
  }
}

onMounted(() => {
  if (mapElement.value) {
    initializeMap(mapElement.value, {
      lat: 46.603354,
      lng: 1.888334,
    }, 6.2)
    addCitiesOnMap()
  }
})

// Watch for changes in destinations or selected cities
watch(() => props.destinations, addCitiesOnMap)
watch(citySelected, onCitySelectedChanges)

defineExpose({
  highlightCityMarker,
  clearHighlightedCityMarker,
})
</script>
