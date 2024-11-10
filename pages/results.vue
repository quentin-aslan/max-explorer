<template>
  <div class="z-10 flex flex-col">
    <!-- Formulaire de recherche -->
    <header
      v-if="!isMobile"
      ref="desktopHeader"
      class="fixed hidden lg:flex w-full"
    >
      <SearchWithResults
        class="flex"
        @research="onResearch"
      />
    </header>
    <header
      v-if="isMobile"
      ref="mobileHeader"
      class="fixed lg:hidden w-full bg-max-bg"
    >
      <SearchDetailsMobile />
      <div
        class="flex flex-col justify-center bg-max-action text-white text-lg text-center font-bold z-50 cursor-pointer"
        @click="isCityListVisibleOnMobile = !isCityListVisibleOnMobile"
      >
        <span v-if="isCityListVisible">Afficher la carte <i class="pi pi-map" /> </span>
        <span v-else>Afficher la liste <i class="pi pi-map-marker" /> </span>
      </div>
    </header>
    <section
      v-if="!isFetchDestinationLoading"
      :style="{
        'max-height': contentMainMinHeight,
        'margin-top': contentMainMarginTop,
      }"
    >
      <!-- Section pour les résultats -->
      <h2
        v-if="noResults"
        class="text-3xl text-max-action text-center"
      >
        Aucun Résultat :/
      </h2>
      <section
        v-else
        class="flex flex-col lg:flex-row gap-2 bg-max-bg"
      >
        <!-- Liste des villes accessibles -->
        <div
          v-if="isCityListVisible && !isTripMode"
          class="lg:w-[50%] p-4"
        >
          <CityList
            v-model="destinationSelected"
            :destinations="destinations"
          />
        </div>

        <!--  Desktop Map View (fixée à droite) -->
        <div
          v-if="isMapVisible && !isTripMode"
          class="w-full lg:w-[50%] fixed right-0"
        >
          <Map
            ref="mapDesktop"
            v-model="destinationSelected"
            class="w-full h-full"
            :destinations="destinations"
            :style="{
              'max-height': contentMainMinHeight,
            }"
          />
        </div>

        <!--  Ville départ et d'arrivée communiqué -->
        <div
          v-if="isTripMode"
          class="p-4"
        >
          <TrainList />
        </div>
      </section>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useDestinations } from '~/composables/use-destinations'
import { useIsMobile } from '~/composables/use-is-mobile'
import { useSearchForm } from '~/composables/use-search-form'
import type { Destination } from '~/types/common'

const { initFormValue, research, destinationStation } = useSearchForm() // Import destinationStation and research

type QueryProps = {
  departureStation?: string
  destinationStation?: string
  departureDate?: string
  returnDate?: string
}

const route = useRoute()
const { startLoading, stopLoading } = useLoader()

const { destinations, fetchDestinations, isFetchDestinationLoading } = useDestinations()

const toast = useToast()

const getResults = async () => {
  startLoading()
  const { departureStation, destinationStation, departureDate, returnDate }: QueryProps = route.query
  if (!departureStation || !departureDate) {
    stopLoading()
    navigateTo('/')
    return
  }

  const departureDateConverted = new Date(departureDate)
  const returnDateConverted = (returnDate) ? new Date(returnDate) : undefined

  await fetchDestinations(departureStation, destinationStation, departureDateConverted, returnDateConverted)
  initFormValue(departureStation, destinationStation, departureDateConverted, returnDateConverted)

  stopLoading()
}

const { isMobile } = useIsMobile()
const isCityListVisibleOnMobile = ref(true)
const isCityListVisible = computed(() => !isMobile.value || (isMobile.value && isCityListVisibleOnMobile.value))
const isMapVisible = computed(() => !isMobile.value || (isMobile.value && !isCityListVisibleOnMobile.value))
const isTripMode = computed(() => route.query.destinationStation)
const noResults = computed(() => !destinations.value || destinations.value.length === 0)
const { mobileHeader, desktopHeader, contentMainMarginTop, contentMainMinHeight } = useHeaderHeights(isMobile)

const destinationSelected = ref<Destination>(null)

// Watch destinationStation, and trigger research when it changes
watch(destinationStation, (newDestination) => {
  if (newDestination) {
    research() // Automatically trigger search when a destination is selected
  }
})

watch(
  () => route.query,
  async () => {
    await getResults() // Re-fetch results whenever route query parameters change
  },
  { immediate: true }, // Run immediately to fetch results on initial load as well
)

watch(destinations, () => destinationSelected.value = null)

watch(destinationSelected, (destination) => {
  if (destination) console.log(destination.departureJourneys[0].map(t => ({ o: t.origin, d: t.destination })))
})

const onResearch = () => {
  setTimeout(() => {
    getResults()
  }, 200)
}

onBeforeMount(() => {
  getResults()
})
</script>
