<template>
  <div class="flex flex-row gap-2 items-center p-2 bg-blue-900 text-white">
    <i class="pi pi-angle-left text-4xl font-bold" @click="navigateTo('/')"></i>
    <div class="flex flex-col gap-1">
      <h1 class="text-xl">Ville de départ : <span class="text-2xl font-bold">{{ departureStation }}</span></h1>
      <div class="flex flex-row gap-2">
        <span>
          <span class="text-gray-100">Du </span> <span class="font-semibold">{{ departureDate?.toISOString().slice(0, 10) }}</span>
        </span>
        <span>
          <span class="text-gray-100">au </span> <span class="font-semibold">{{ returnDate?.toISOString().slice(0, 10) }}</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>

const { departureStation, destinationStation, departureDate, returnDate } = useSearchForm()
const emit = defineEmits(['search-details-click']);
</script>