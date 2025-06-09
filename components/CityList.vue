<template>
  <div class="flex flex-col gap-4 overflow-scroll h-full">
    <!-- Header avec compteur stylé -->
    <div class="sticky top-0 bg-max-bg/95 backdrop-blur-sm rounded-2xl p-4 border-2 border-max-action/20 shadow-lg">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-sans-bold text-max-pri">
          🗺️ Tes destinations
        </h2>
        <div class="bg-max-action text-white px-4 py-2 rounded-full">
          <span class="font-sans-bold text-sm">
            {{ destinations.length }} trouvée{{ destinations.length > 1 ? 's' : '' }}
          </span>
        </div>
      </div>
      <p class="text-max-pri/70 text-sm mt-2">
        Clique sur une ville pour voir les trains disponibles
      </p>
    </div>

    <!-- Liste des destinations -->
    <div class="space-y-3">
      <div
        v-for="(destination, index) in sortDestinations"
        :key="destination.destinationName"
        class="group relative overflow-hidden bg-white rounded-2xl border-2 border-max-sec/20 hover:border-max-action/40 cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
        :class="{
          'ring-2 ring-max-action ring-offset-2': destinationSelected?.destinationName === destination.destinationName,
          'animate-fade-in-up': true,
        }"
        :style="{ 'animation-delay': `${index * 50}ms` }"
        @click="() => onDestinationClick(destination)"
      >
        <!-- Effet de gradient au hover -->
        <div class="absolute inset-0 bg-gradient-to-r from-max-action/10 to-max-special/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <!-- Contenu principal -->
        <div class="relative p-6">
          <div class="flex items-center justify-between">
            <!-- Nom de la ville avec icône -->
            <div class="flex items-center space-x-4 flex-1">
              <div class="w-12 h-12 bg-max-special/20 rounded-full flex items-center justify-center group-hover:bg-max-special/30 transition-colors duration-300">
                <span class="text-lg">🏛️</span>
              </div>
              <div class="flex-1">
                <h3 class="text-xl font-sans-bold text-max-pri group-hover:text-max-action transition-colors duration-300">
                  {{ destination.destinationName }}
                </h3>
                <div class="flex items-center space-x-4 mt-1">
                  <p class="text-sm text-max-pri/60 font-sans-medium">
                    {{ getTotalTrains(destination) }} train{{ getTotalTrains(destination) > 1 ? 's' : '' }} disponible{{ getTotalTrains(destination) > 1 ? 's' : '' }}
                  </p>
                  <!-- Informations aller/retour élégantes -->
                  <div class="flex items-center space-x-2 text-xs">
                    <span
                      v-if="destination.departureJourneys.length > 0"
                      class="text-max-action font-sans-semibold"
                    >
                      {{ destination.departureJourneys.length }} aller{{ destination.departureJourneys.length > 1 ? 's' : '' }}
                    </span>
                    <span
                      v-if="destination.departureJourneys.length > 0 && destination.returnJourneys.length > 0"
                      class="text-max-pri/30"
                    >•</span>
                    <span
                      v-if="destination.returnJourneys.length > 0"
                      class="text-max-special font-sans-semibold"
                    >
                      {{ destination.returnJourneys.length }} retour{{ destination.returnJourneys.length > 1 ? 's' : '' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Badge weekend compact -->
            <div
              v-if="destination.departureJourneys.length > 0 && destination.returnJourneys.length > 0"
              class="flex-shrink-0"
            >
              <div class="bg-gradient-to-r from-green-500 to-emerald-400 text-white px-3 py-1 rounded-full shadow-sm">
                <span class="text-xs font-sans-bold">✨ Weekend</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Flèche d'indication -->
        <div class="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
          <i class="pi pi-arrow-right text-max-action text-xl" />
        </div>
      </div>
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
    // Priorise les destinations avec aller ET retour (weekend)
    const aHasBoth = a.departureJourneys.length > 0 && a.returnJourneys.length > 0
    const bHasBoth = b.departureJourneys.length > 0 && b.returnJourneys.length > 0

    if (aHasBoth && !bHasBoth) return -1
    if (!aHasBoth && bHasBoth) return 1

    // Ensuite par trafic de la gare
    return b.trainStation.traffic - a.trainStation.traffic
  })
})

const getTotalTrains = (destination: TripViewModel) => {
  return destination.departureJourneys.length + destination.returnJourneys.length
}

const onDestinationClick = (destination: TripViewModel) => {
  if (destinationSelected.value === destination) {
    destinationSelected.value = null
    return
  }
  destinationSelected.value = destination
}
</script>

<style scoped>
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.6s ease-out forwards;
}

/* Style pour le scroll */
:deep(.overflow-scroll) {
  scrollbar-width: thin;
  scrollbar-color: rgba(var(--max-action-rgb), 0.3) transparent;
}

:deep(.overflow-scroll::-webkit-scrollbar) {
  width: 6px;
}

:deep(.overflow-scroll::-webkit-scrollbar-track) {
  background: transparent;
}

:deep(.overflow-scroll::-webkit-scrollbar-thumb) {
  background-color: rgba(var(--max-action-rgb), 0.3);
  border-radius: 3px;
}

:deep(.overflow-scroll::-webkit-scrollbar-thumb:hover) {
  background-color: rgba(var(--max-action-rgb), 0.5);
}
</style>
