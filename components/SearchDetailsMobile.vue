<template>
  <div class="bg-white border-b-2 border-max-action shadow-sm">
    <!-- Header principal -->
    <div class="flex items-center justify-between p-4">
      <!-- Bouton retour avec logique corrigée -->
      <button
        class="flex items-center justify-center w-10 h-10 bg-max-bg hover:bg-max-action/10 rounded-full transition-colors duration-200 border border-max-sec/20"
        @click="goBackToList"
      >
        <i class="pi pi-arrow-left text-max-pri text-lg" />
      </button>

      <!-- Informations centrales -->
      <div class="flex-1 mx-4">
        <div class="text-center">
          <h1 class="text-lg font-sans-bold text-max-pri leading-tight">
            {{ departureStation }}
            <span v-if="currentDestination"> → {{ currentDestination }}</span>
          </h1>
          <div class="flex items-center justify-center space-x-2 mt-1">
            <span class="text-sm text-max-pri/70 font-sans-medium">
              {{ formatDate(departureDate) }}
            </span>
            <span
              v-if="returnDate"
              class="text-max-pri/40"
            >•</span>
            <span
              v-if="returnDate"
              class="text-sm text-max-pri/70 font-sans-medium"
            >
              {{ formatDate(returnDate) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Bouton modifier la recherche -->
      <button
        class="flex items-center justify-center w-10 h-10 bg-max-bg hover:bg-max-action/10 rounded-full transition-colors duration-200 border border-max-sec/20"
        @click="navigateTo('/')"
      >
        <i class="pi pi-pencil text-max-pri text-sm" />
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { toISOStringWithOffset } from '~/utils'

const { departureStation, departureDate, returnDate } = useSearchForm()
const route = useRoute()

// Destination actuelle affichée (réactive)
const currentDestination = computed(() => route.query.destinationStation as string)

const formatDate = (date: Date | null) => {
  if (!date) return ''
  return toISOStringWithOffset(date)?.slice(5, 10).replace('-', '/')
}

const goBackToList = () => {
  // Si on a une destination sélectionnée ET qu'il y a plusieurs destinations possibles
  if (currentDestination.value) {
    // Retourner à la liste des destinations
    const newQuery = { ...route.query }
    delete newQuery.destinationStation
    navigateTo({ path: '/results', query: newQuery })
  }
  else {
    navigateTo('/')
  }
}
</script>
