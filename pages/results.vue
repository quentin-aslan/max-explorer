<template>
  <TheLoader />
  <div class="z-10 flex flex-col max-h-screen overflow-hidden">
    <!-- Formulaire de recherche -->
    <SearchFormHorizontal />
    <section v-if="!isFetchTrainsLoading">
      <!-- Section pour les résultats -->
      <h2 v-if="cities.length === 0" class="text-3xl text-blue-900">Aucun Résultat :/</h2>
      <section v-else class="flex flex-col lg:flex-row gap-2">
        <!-- Liste des villes accessibles -->
        <div class="lg:w-[40%] h-screen p-4">
          <CityList
              v-if="cities.length"
              v-model="citySelected"
              :cities="cities"
              class="hidden lg:flex"
          />
        </div>

        <!--  Desktop Map View (fixée à droite) -->
        <div
            v-if="cities.length > 0"
            class="h-screen w-full lg:w-[60%] fixed right-0"
        >
          <Map
              ref="mapDesktop"
              class="w-full h-full"
              v-model="citySelected"
              :cities="cities"
          />
        </div>
      </section>
    </section>
  </div>
</template>


<script lang="ts" setup>
import { ref } from 'vue';
import {useTrains} from "~/composables/use-trains";

const { departureTrains, cities, isFetchTrainsLoading  } = useTrains()

watch(departureTrains, () => citySelected.value = null )

const citySelected = ref<City>(null);

watch(citySelected, () => {
  // TODO: Center to the city on the map + hightlight the city card
  console.log('TODO: Center to the city on the map + hightlight the city card')
})
</script>
