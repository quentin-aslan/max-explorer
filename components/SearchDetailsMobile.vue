<template class="lg:hidden">
  <div class="flex flex-row gap-2 items-center p-2 text-max-pri border-b-4 border-b-max-action">
    <button @click="navigateTo('/')">
      <i class="pi pi-angle-left text-4xl font-bold text-max-pri" />
    </button>
    <div class="flex flex-col gap-1 pl-2">
      <div class="flex flex-row items-center gap-2 text-xl">
        <i class="pi pi-map-marker font-bold text-xl" /> <span class="">{{ departureStation }}</span>
        <span v-if="destinationStation"> - {{ destinationStation }}</span>
      </div>
      <div class="flex flex-row items-center gap-2 text-lg">
        <div class="flex items-center">
          <span>{{ toISOStringWithOffset(departureDate)?.slice(0, 10) }}</span>
          <!-- Cross icon to clear departure date -->
          <i
            v-if="departureDate"
            class="pi pi-times ml-1 cursor-pointer text-max-sec hover:text-max-pri"
            @click="clearDepartureDate"
          ></i>
        </div>
        <i
          v-if="returnDate"
          class="pi pi-arrow-circle-right font-extrabold"
        />
        <div class="flex items-center" v-if="returnDate">
          <span>{{ toISOStringWithOffset(returnDate)?.slice(0, 10) }}</span>
          <!-- Cross icon to clear return date -->
          <i
            class="pi pi-times ml-1 cursor-pointer text-max-sec hover:text-max-pri"
            @click="clearReturnDate"
          ></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { toISOStringWithOffset } from '~/utils'

const { departureStation, destinationStation, departureDate, returnDate } = useSearchForm()
const emit = defineEmits(['search-details-click'])

// Function to clear departure date
const clearDepartureDate = () => {
  departureDate.value = null
}

// Function to clear return date
const clearReturnDate = () => {
  returnDate.value = null
}
</script>
