<template>
  <div class="flex flex-col md:flex-row flex-wrap gap-6">
    <Card v-for="city in cities" @click="() => onCityClick(city)" class="w-full cursor-pointer hover:-translate-x-0.5">
      <template #title>
        <div class="flex flex-row justify-between items-center">
          <span>{{ city }}</span>
          <span class="text-sm">Trains Disponible (A/R) : <strong>{{ getDepartureTrainsFromCity(city).length + getReturnTrainsFromCity(city).length}}</strong></span>
        </div>
      </template>
      <template #content>
        <div v-if="citySelected === city">
          <TrainTable :trains="getDepartureTrainsFromCity(city)" />
          <TrainTable :trains="getReturnTrainsFromCity(city)" />

        </div>
      </template>
    </Card>
  </div>
</template>


<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps<{
  cities: string[];
  citySelected: Ref<string | null>;
}>();

const { getDepartureTrainsFromCity, getReturnTrainsFromCity } = useTrains();


const emit = defineEmits(['cityClick']);

const onCityClick = (cityName: string) => {
  emit('cityClick', cityName);
};
</script>
