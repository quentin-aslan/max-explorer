<template>
  <div class="flex flex-col gap-2 h-screen overflow-scroll">
    <div
      v-for="city in cities"
      :key="city.id"
      class="w-full cursor-pointer hover:-translate-x-0.5"
      @click="() => onCityClick(city)"
    >
      {{ city.name }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { City } from '~/types'

const props = defineProps<{
  cities: City[]
}>()

const citySelected = defineModel()

const onCityClick = (city: City) => {
  if (citySelected.value === city) {
    citySelected.value = null
    return
  }
  citySelected.value = city
}
</script>
