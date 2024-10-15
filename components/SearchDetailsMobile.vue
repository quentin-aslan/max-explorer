<template>
  <div class="flex flex-row gap-2 items-center p-2 bg-blue-900 text-white">
    <Button @click="navigateTo('/')">
      <i class="pi pi-angle-left text-4xl font-bold"></i>
    </Button>
    <div class="flex flex-col gap-1">
      <div class="flex flex-row items-center gap-2 text-2xl">
        <i class="pi pi-map-marker font-bold text-xl"></i> <span class="">{{ departureStation }}</span>
      </div>
      <div class="flex flex-row items-center gap-2 text-lg">
          <span>{{ departureDate?.toISOString().slice(0, 10) }}</span>
          <i class="pi pi-arrow-circle-right font-extrabold"></i>
          <span>{{ returnDate?.toISOString().slice(0, 10) }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>

const { departureStation, destinationStation, departureDate, returnDate } = useSearchForm()
const emit = defineEmits(['search-details-click']);
</script>