<template>
  <div class="flex flex-col sm:flex-row gap-2 sm:gap-0">
    <DatePicker
      v-model="departureDate"
      :min-date="departureDateMin"
      :max-date="dateMax"
      date-format="dd/mm/yy"
      class="w-full"
      placeholder="Départ"
      :pt="departureCalendar"
    />
    <DatePicker
      v-model="returnDate"
      :min-date="returnDateMin"
      :max-date="dateMax"
      date-format="dd/mm/yy"
      class="w-full"
      placeholder="Retour"
      :pt="returnCalendar"
    />
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
