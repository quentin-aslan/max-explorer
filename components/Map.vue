<template>
  <div
    ref="mapElement"
    class="lg:border lg:border-max-sec lg:rounded-3xl"
    style="height: calc(100vh); width:100%"
  />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useGoogleMaps } from '~/composables/use-google-maps'
import type { RoundTripDestination } from '~/types/common'

type Props = {
  destinations: RoundTripDestination[]
  departureCity?: unknown
}

const props = defineProps<Props>()
const citySelected = defineModel()

const {
  mapElement,
  loadMap,
  addCityMarker,
  map,
  clearMarkers,
  highlightCityMarker,
  clearHighlightedCityMarker,
} = useGoogleMaps()

onMounted(async () => {
  if (mapElement.value) {
    await loadMap(mapElement.value, {
      lat: 46.603354,
      lng: 1.888334,
    }, 6.2)
    addCitiesOnMap()
  }
})

const addCitiesOnMap = () => {
  if (map.value) {
    clearMarkers()
    for (const city of props.destinations) {
      const marker = addCityMarker(city)

      marker?.addListener('click', () => {
        citySelected.value = city
      })

      marker?.addListener('mouseover', () => {
        const oldCitySelected = citySelected.value
        citySelected.value = city
        onCitySelectedChanges(city, oldCitySelected)
      })
    }
  }
}

const onCitySelectedChanges = (newCitySelected: RoundTripDestination, oldCitySelected: RoundTripDestination) => {
  if (oldCitySelected) {
    clearHighlightedCityMarker(oldCitySelected)
  }

  if (newCitySelected) {
    highlightCityMarker(newCitySelected)
  }
}

watch(props.cities, addCitiesOnMap)
watch(citySelected, onCitySelectedChanges)

defineExpose({
  highlightCityMarker,
  clearHighlightedCityMarker,
})
</script>
