<template>
  <div class="flex flex-row">
    <div class="relative w-full">
      <DatePicker
        v-model="departureDate"
        :min-date="departureDateMin"
        :max-date="dateMax"
        date-format="dd/mm/yy"
        class="w-full"
        placeholder=""
        :pt="departureCalendar"
      />
      <!-- Cross icon to clear departure date -->
      <div
        v-if="departureDate"
        class="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-max-sec hover:text-max-pri"
        @mousedown.prevent="clearDepartureDate"
      >
        <i class="pi pi-times"></i>
      </div>
      <label
        class="absolute start-5 text-max-sec font-sans-semibold text-xl duration-300
        transform-translate-y-4 scale-50 top-0 z-10 origin-[0] peer-placeholder-shown:scale-100
        peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-4 peer-focus:scale-75 peer-focus:-translate-y-4"
      >
        Départ
      </label>
    </div>
    <div class="relative w-full">
      <DatePicker
        v-model="returnDate"
        :min-date="returnDateMin"
        :max-date="dateMax"
        date-format="dd/mm/yy"
        class="w-full"
        placeholder=""
        :pt="returnCalendar"
      />
      <!-- Cross icon to clear return date -->
      <div
        v-if="returnDate"
        class="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-max-sec hover:text-max-pri"
        @mousedown.prevent="clearReturnDate"
      >
        <i class="pi pi-times"></i>
      </div>
      <label
        class="absolute start-5 text-max-sec font-sans-semibold text-xl duration-300
        transform-translate-y-4 scale-50 top-0 z-10 origin-[0] peer-placeholder-shown:scale-100
        peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-4 peer-focus:scale-75 peer-focus:-translate-y-4"
      >
        Retour
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const departureDateMin = ref(new Date())
const returnDateMin = computed(() => departureDate.value ?? departureDateMin.value)
// 30 day from now because SNCF API only allows 30 days in the future
const dateMax = ref(new Date(new Date().setDate(new Date().getDate() + 30)))

const departureDate = defineModel<Date>('departureDate')
const returnDate = defineModel<Date>('returnDate')

// Function to clear departure date
const clearDepartureDate = () => {
  departureDate.value = null
}

// Function to clear return date
const clearReturnDate = () => {
  returnDate.value = null
}

const departureCalendar = ref({
  pcInputText: {
    root: {
      class: '!rounded-l-lg !h-[58px] !px-5 !pb-3 !pt-5 !font-sans-semibold !text-max-pri !bg-white !border !border-max-sec peer',
    },
  },
})

const returnCalendar = ref({
  pcInputText: {
    root: {
      class: '!rounded-r-lg !h-[58px] !px-5 !pb-3 !pt-5 !font-sans-semibold !text-max-pri !bg-white !border !border-max-sec peer',
    },
  },
})
</script>

<style scoped>
:deep() .p-inputtext {
  @apply border-max-sec;
  @apply font-sans-semibold;
  @apply text-max-pri;
  border-radius: 0;
  @apply h-[58px];
  @apply px-5 pb-3 pt-5;
  @apply bg-white;
  @apply appearance-none;
  @apply focus:outline-none focus:ring-0 focus:border-max-pri;
}

::deep() .p-inputtext::placeholder {
  @apply text-max-sec;
  @apply opacity-0;
}

/* Fix for the floating label behavior with PrimeVue Calendar */
::deep() .p-calendar.p-component:focus-within + label,
::deep() .p-calendar.p-component.p-inputwrapper-filled + label {
  @apply top-4 scale-75 -translate-y-4;
}
</style>
