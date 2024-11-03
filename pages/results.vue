<template>
  <div class="z-10 flex flex-col max-h-screen overflow-hidden">
    <!-- Formulaire de recherche -->
    <header>
      <SearchWithResults
        class="hidden lg:flex"
        @research="onResearch"
      />
      <SearchDetailsMobile class="lg:hidden" />
    </header>
    <section v-if="!isFetchDestinationLoading">
      <!-- Section pour les résultats -->
      <h2
        v-if="noResults"
        class="text-3xl text-blue-900"
      >
        Aucun Résultat :/
      </h2>
      <section
        v-else
        class="flex flex-col lg:flex-row gap-2"
      >
        <!-- Liste des villes accessibles -->
        <div
          v-if="isCityListVisible"
          class="lg:w-[50%] p-4"
        >
          <CityList
            v-model="destinationSelected"
            :destinations="destinations"
          />
        </div>

        <!--  Desktop Map View (fixée à droite) -->
        <div
          v-if="isMapVisible"
          class="w-full lg:w-[50%] fixed right-0 m-2"
        >
          <Map
            ref="mapDesktop"
            v-model="destinationSelected"
            class="w-full h-full"
            :destinations="destinations"
          />
        </div>

        <div
          class="lg:hidden fixed bottom-0 flex flex-col justify-center w-full bg-blue-900 text-white h-[8%] text-lg text-center font-bold"
          @click="isCityListVisibleOnMobile = !isCityListVisibleOnMobile"
        >
          <span v-if="isCityListVisible">Afficher la carte <i class="pi pi-map" /> </span>
          <span v-else>Afficher la liste des destination <i class="pi pi-map-marker" /> </span>
        </div>
      </section>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useTrains } from '~/composables/use-trains'
import type { City } from '~/types'
import { useDestinations } from '~/composables/use-destinations'
import type { Destination } from '~/types/common'

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

const { initFormValue } = useSearchForm()

const getResults = async () => {
  startLoading()
  const { departureStation, destinationStation, departureDate, returnDate }: QueryProps = route.query
  if (!departureStation || !departureDate || !returnDate) {
    navigateTo('/')
    return
  }

  const departureDateFormatted = new Date(departureDate)
  const returnDateFormatted = new Date(returnDate)

  await fetchDestinations(departureStation, destinationStation, departureDateFormatted, returnDateFormatted)
  initFormValue(departureStation, destinationStation, departureDateFormatted, returnDateFormatted)

  stopLoading()
}

const { isMobile } = useIsMobile()
const isCityListVisibleOnMobile = ref(true)
const isCityListVisible = computed(() => !isMobile.value || (isMobile.value && isCityListVisibleOnMobile.value))
const isMapVisible = computed(() => !isMobile.value || (isMobile.value && !isCityListVisibleOnMobile.value))
const noResults = computed(() => !destinations.value || destinations.value.length === 0)

watch(destinations, () => destinationSelected.value = null)

const destinationSelected = ref<Destination>(null)

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
