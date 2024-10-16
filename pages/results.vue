<template>
  <TheLoader />
  <div class="z-10 flex flex-col max-h-screen overflow-hidden">
    <!-- Formulaire de recherche -->
    <header>
      <SearchFormHorizontal class="hidden lg:flex" />
      <SearchDetailsMobile class="lg:hidden" />
    </header>
    <section v-if="!isFetchTrainsLoading">
      <!-- Section pour les résultats -->
      <h2 v-if="noResults" class="text-3xl text-blue-900">Aucun Résultat :/</h2>
      <section v-else class="flex flex-col lg:flex-row gap-2">
        <!-- Liste des villes accessibles -->
        <div v-if="isCityListVisible" class="lg:w-[40%] h-screen p-4">
          <CityList
              v-model="citySelected"
              :cities="cities"
          />
        </div>

        <!--  Desktop Map View (fixée à droite) -->
        <div
            v-if="isMapVisible"
            class="h-screen w-full lg:w-[60%] fixed right-0"
        >
          <Map
              ref="mapDesktop"
              class="w-full h-full"
              v-model="citySelected"
              :cities="cities"
          />
        </div>

        <div
            @click="isCityListVisibleOnMobile = !isCityListVisibleOnMobile"
             class="lg:hidden fixed bottom-0 flex flex-col justify-center w-full bg-blue-900 text-white h-[8%] text-lg text-center font-bold"
        >
          <span v-if="isCityListVisible">Afficher la carte <i class="pi pi-map"></i> </span>
          <span v-else>Afficher la liste des destination <i class="pi pi-map-marker"></i> </span>
        </div>

      </section>
    </section>
  </div>
</template>


<script lang="ts" setup>
import { ref } from 'vue';
import {useTrains} from "~/composables/use-trains";
import type {City} from "~/types";

const route = useRoute()
const { startLoading, stopLoading } = useLoader()
const { departureTrains, cities, isFetchTrainsLoading, fetchTrains  } = useTrains()
const toast = useToast()

const { initFormValue } = useSearchForm()

const getResults = async () => {
  startLoading()
  let { departureStation, departureDate, returnDate } = route.query
  if(!departureStation || !departureDate || !returnDate) {
    navigateTo('/')
    return
  }

  departureDate = new Date(departureDate)
  returnDate = new Date(returnDate)

  await fetchTrains(departureDate, returnDate, departureStation)
  // TODO: Utiliser un store ?
  initFormValue(departureDate.value, undefined, departureDate, returnDate)
  stopLoading()
}

await getResults()
watch(route, getResults)

const { isMobile } = useIsMobile()
const isCityListVisibleOnMobile = ref(true)
const isCityListVisible = computed(() => !isMobile.value || (isMobile.value && isCityListVisibleOnMobile.value))
const isMapVisible = computed(() => !isMobile.value || (isMobile.value && !isCityListVisibleOnMobile.value))
const noResults = computed(() => !cities.value || cities.value.length === 0)

watch(departureTrains, () => citySelected.value = null )

const citySelected = ref<City>(null);
</script>
