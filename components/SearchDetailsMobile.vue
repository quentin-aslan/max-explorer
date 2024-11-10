<template class="lg:hidden">
  <div class="flex flex-row gap-2 items-center p-2 text-max-pri border-b-4 border-b-max-action">
    <button @click="navigateTo('/')">
      <i class="pi pi-angle-left text-4xl font-bold text-max-pri" />
    </button>
    <div class="flex flex-col gap-1 pl-2">
      <div class="flex flex-row items-center gap-2 text-2xl">
        <i class="pi pi-map-marker font-bold text-xl" /> <span class="">{{ departureStation }}</span>
        <span v-if="destinationStation"> ....... {{ destinationStation }}</span>
      </div>
      <div class="flex flex-row items-center gap-2 text-lg">
        <span>{{ toISOStringWithOffset(departureDate)?.slice(0, 10) }}</span>
        <i
          v-if="returnDate"
          class="pi pi-arrow-circle-right font-extrabold"
        />
        <span>{{ toISOStringWithOffset(returnDate)?.slice(0, 10) }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { toISOStringWithOffset } from '~/utils'

const { departureStation, destinationStation, departureDate, returnDate } = useSearchForm()
const emit = defineEmits(['search-details-click'])
</script>
