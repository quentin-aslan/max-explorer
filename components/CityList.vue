<template>
  <div
    class="flex flex-col gap-2 overflow-scroll"
  >
    {{ destinations.length }} destinations trouvées.
    <div
      v-for="destination in destinations"
      :key="destination.id"
      class="w-full cursor-pointer border rounded-xl bg-white border-max-sec pb-4 pt-4 pl-3 pr-3 flex flex-row justify-between"
      @click="() => onDestinationClick(destination)"
    >
      <h2 class="font-sans-semibold text-max-pri">
        {{ destination.destinationName }}
      </h2>
      <h3 class="font-sans-semibold text-max-sec">
        {{ destination.departureJourneys.length + destination.returnJourneys.length }} trains.
      </h3>
      <!--      Premier Train au depart de
      {{ destination.destinationName }} - Aller : {{ destination.departureJourneys.length }} | Retour : {{ destination.returnJourneys.length }}
   -->
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { RoundTripDestination } from '~/types/common'

const props = defineProps<{
  destinations: RoundTripDestination[]
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
