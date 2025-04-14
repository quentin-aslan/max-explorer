<template>
  <div class="z-10 flex flex-col">
    <!-- Formulaire de recherche -->
    <header
      v-if="!isMobile"
      ref="desktopHeader"
      class="fixed z-20 hidden lg:flex w-full"
    >
      <SearchWithResults
        class="flex"
        @research="onResearch"
      />
    </header>
    <header
      v-if="isMobile"
      ref="mobileHeader"
      class="fixed z-20 lg:hidden w-full bg-max-bg"
    >
      <SearchDetailsMobile />
      <div
        v-if="!isTripMode"
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
      <div
        v-if="noResults"
        class="flex flex-row text-3xl text-max-action text-center justify-center"
      >
        <Message severity="warn">
          <span class="text-3xl">Aucun Résultat :/</span>
        </Message>
      </div>
      <section
        v-else
        class="bg-max-bg"
      >
        <div class="flex flex-col lg:flex-row gap-2 ">
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
            <TheMapLeaflet
              ref="mapDesktop"
              v-model="destinationSelected"
              class="w-full h-full"
              :destinations="destinations"
              :style="{
                'max-height': contentMainMinHeight,
              }"
            />
          </div>
        </div>

        <!--  Ville départ et d'arrivée communiqué -->
        <div
          v-if="isTripMode && destinationSelected"
          class="p-4 flex flex-row justify-center"
        >
          <div class="w-full lg:w-2/3">
            <TrainList
              :departure-journeys="destinationSelected.departureJourneys"
              :return-journeys="destinationSelected.returnJourneys"
            />
          </div>
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
import type { RoundTripDestination } from '~/types/common'
import TheMapLeaflet from '~/components/TheMapLeaflet.vue'

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
  startLoading('Recherche des destinations... Cela peut prendre jusqu\'a une minute ...')
  const { departureStation, destinationStation, departureDate, returnDate }: QueryProps = route.query
  if (!departureStation || !departureDate) {
    stopLoading()
    navigateTo('/')
    return
  }

  const departureDateConverted = new Date(departureDate)
  const returnDateConverted = (returnDate) ? new Date(returnDate) : undefined

  initFormValue(departureStation, destinationStation, departureDateConverted, returnDateConverted)
  await fetchDestinations(departureStation, destinationStation, departureDateConverted, returnDateConverted)

  stopLoading()
}

const { isMobile } = useIsMobile()
const isCityListVisibleOnMobile = ref(true)
const isCityListVisible = computed(() => !isMobile.value || (isMobile.value && isCityListVisibleOnMobile.value))
const isMapVisible = computed(() => !isMobile.value || (isMobile.value && !isCityListVisibleOnMobile.value))
const isTripMode = computed(() => route.query.destinationStation)
const noResults = computed(() => !destinations.value || destinations.value.length === 0)
const destinationSelected = ref<RoundTripDestination | null>(null)
const { mobileHeader, desktopHeader, contentMainMarginTop, contentMainMinHeight } = useHeaderHeights(isMobile)

watch(destinations, () => destinationSelected.value = (isTripMode.value) ? destinations.value?.[0] : null)

watch(destinationSelected, (destination) => {
  if (destination) {
    destinationStation.value = destination.destinationName
    research() // Automatically trigger search when a destination is selected
  }
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
