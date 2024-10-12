<template>
  <TheLoader />
  <div class="z-10 flex flex-col gap-4 p-6">
    <!-- Formulaire de recherche -->
    <SearchFormHorizontal />

    <!-- Section pour les résultats -->
    <h2 v-if="citiesList.length === 0">Aucun Résultat :/</h2>
    <section v-else class="flex flex-col lg:flex-row gap-2 mt-8">
      <!-- Liste des villes accessibles -->
      <CityList
          v-if="citiesList.length"
          :cities="citiesList"
          :city-selected="citySelected"
          @cityClick="onCityClick"
          class="w-full md:w-2/3"
      />

      <!-- Placeholder de la carte -->
      <Map v-model="citySelected" class="w-full md:w-1/3" />
    </section>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type {Train} from "~/types";
import {useTrains} from "~/composables/use-trains";

const { departureTrains, citiesList  } = useTrains()

watch(departureTrains, () => citySelected.value = null )

const citySelected = ref<string | null>(null);

watch(citySelected, () => {
  // TODO: Center to the city on the map + hightlight the city card
  console.log('TODO: Center to the city on the map + hightlight the city card')
})

const onCityClick = (city: string) => {
  if (citySelected.value === city) {
    citySelected.value = null;
    return;
  }
  citySelected.value = city;
};
</script>
