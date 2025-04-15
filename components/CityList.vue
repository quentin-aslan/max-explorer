<template>
  <div
    class="flex flex-col gap-2 overflow-scroll"
  >
    {{ destinations.length }} destinations trouvées.
    <div
      v-for="destination in sortDestinations"
      :key="destination.destinationName"
      class="w-full cursor-pointer border rounded-xl bg-white border-max-sec pb-4 pt-4 pl-3 pr-3 flex flex-row justify-between"
      @click="() => onDestinationClick(destination)"
    >
      <h2 class="font-sans-semibold text-max-pri">
        {{ destination.destinationName }}
      </h2>
      <h3 class="font-sans-semibold text-max-sec">
        {{ destination.departureJourneys.length + destination.returnJourneys.length }} voyages.
      </h3>
      <!--      Premier Train au depart de
      {{ destination.destinationName }} - Aller : {{ destination.departureJourneys.length }} | Retour : {{ destination.returnJourneys.length }}
   -->
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { TripViewModel } from '~/domains/trips/entities/view-models/trip.view-model'

const props = defineProps<{
  destinations: TripViewModel[]
}>()

const destinationSelected = defineModel()

const sortDestinations = computed(() => {
  return [...props.destinations]?.sort((a, b) => {
    return b.trainStation.traffic - a.trainStation.traffic
  })
})

const onDestinationClick = (destination: TripViewModel) => {
  if (destinationSelected.value === destination) {
    destinationSelected.value = null
    return
  }
  destinationSelected.value = destination
}
</script>
