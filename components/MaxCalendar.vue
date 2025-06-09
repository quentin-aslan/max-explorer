<template>
  <div class="flex flex-col sm:flex-row gap-2 sm:gap-0">
    <!-- Départ avec bouton clear -->
    <div class="relative w-full">
      <DatePicker
        v-model="departureDate"
        :min-date="departureDateMin"
        :max-date="dateMax"
        date-format="dd/mm/yy"
        class="w-full"
        placeholder="Départ"
        :pt="departureCalendar"
      />
      <button
        v-if="departureDate"
        type="button"
        class="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 bg-max-sec/20 hover:bg-max-sec/30 rounded-full flex items-center justify-center transition-colors duration-200 group z-10"
        @click="clearDepartureDate"
      >
        <i class="pi pi-times text-xs text-max-sec group-hover:text-max-pri" />
      </button>
    </div>

    <!-- Retour avec bouton clear -->
    <div class="relative w-full">
      <DatePicker
        v-model="returnDate"
        :min-date="returnDateMin"
        :max-date="dateMax"
        date-format="dd/mm/yy"
        class="w-full"
        placeholder="Retour (optionnel)"
        :pt="returnCalendar"
      />
      <button
        v-if="returnDate"
        type="button"
        class="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 bg-max-sec/20 hover:bg-max-sec/30 rounded-full flex items-center justify-center transition-colors duration-200 group z-10"
        @click="clearReturnDate"
      >
        <i class="pi pi-times text-xs text-max-sec group-hover:text-max-pri" />
      </button>
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

const clearDepartureDate = () => {
  departureDate.value = undefined
}

const clearReturnDate = () => {
  returnDate.value = undefined
}

const departureCalendar = ref({
  pcInputText: {
    root: {
      class: '!rounded-xl sm:!rounded-l-xl sm:!rounded-r-none',
    },
  },
})

const returnCalendar = ref({
  pcInputText: {
    root: {
      class: '!rounded-xl sm:!rounded-r-xl sm:!rounded-l-none',
    },
  },
})
</script>

<style scoped>
:deep() .p-inputtext {
  @apply border-max-sec/30 border-2;
  @apply font-sans-medium;
  @apply text-max-pri;
  @apply py-3 px-4;
  @apply transition-all duration-200;
  @apply placeholder:text-max-sec/60;
}

:deep() .p-inputtext:focus {
  @apply border-max-action;
  @apply shadow-lg;
}

/* Mobile: Boutons d'icône plus grands */
@media (max-width: 640px) {
  :deep() .p-datepicker-trigger {
    @apply w-10 h-10;
  }

  :deep() .p-inputtext {
    @apply text-base;
    min-height: 48px;
  }
}
</style>
