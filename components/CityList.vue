<template>
  <div class="flex flex-col gap-2 h-screen overflow-scroll">
    DESTINATIONS AU TOTAL : {{ destinations.length }}
    <div
      v-for="destination in destinations"
      :key="destination.id"
      class="w-full cursor-pointer hover:-translate-x-0.5"
      @click="() => onDestinationClick(destination)"
    >
      Premier Train au depart de
      {{ destination.destinationName }} - Aller : {{ destination.departureJourneys.length }} | Retour : {{ destination.returnJourneys.length }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Destination } from '~/types/common'

const props = defineProps<{
  destinations: Destination[]
}>()

const destinationSelected = defineModel()

const onDestinationClick = (destination: Destination) => {
  if (destinationSelected.value === destination) {
    destinationSelected.value = null
    return
  }
  destinationSelected.value = destination
}
</script>
