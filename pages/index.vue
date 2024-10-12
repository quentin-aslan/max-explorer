<template>
  <TheLoader />
  <div class="z-10 flex flex-col gap-4 mx-10">
    <header class="mb-6">
      <h1 class="text-3xl font-bold text-gray-700">
        TGV MAAAX, EXPLORE TON PAYS !
      </h1>
    </header>

    <!-- Formulaire de recherche -->
    <SearchForm
        v-model:departureStation="departureStation"
        v-model:departureDate="departureDate"
        v-model:returnDate="returnDate"
        @submit="refreshResults"
    />

    <!-- Section pour les résultats -->
    <section class="flex flex-col lg:flex-row gap-2 mt-8">
      <!-- Liste des villes accessibles -->
      <CityList
          v-if="citiesList.length"
          :cities="citiesList"
          :city-selected="citySelected"
          @cityClick="onCityClick"
          class="w-full md:w-2/3"
      />

      <!-- Placeholder de la carte -->
      <Map class="w-full md:w-1/3" />
    </section>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type {Train} from "~/types";
import {useTrains} from "~/composables/use-trains";

const { departureTrains, returnTrains, fetchTrains, citiesList  } = useTrains()

const trainsDisplayed = ref<Train[]>([]);

const departureStation = ref('Toulouse');
const departureDate = ref<Date | null>(null);
const returnDate = ref<Date | null>(null);
const isFullDisplayed = ref(false);

const citySelected = ref<string | null>(null);

const onTrainClick = (train: Train) => {
  selectedDepartureTrain.value = train;
  trainsDisplayed.value = returnTrains.value.filter(
      (t) => t.origine === train.destination
  );
};

const onCityClick = (city: string) => {
  console.log('city click', city)
  if (citySelected.value === city) {
    citySelected.value = null;
    return;
  }
  citySelected.value = city;
};

const refreshResults = async () => {
  citySelected.value = null;
  await fetchTrains(departureStation.value, departureDate.value, returnDate.value)
};
</script>
