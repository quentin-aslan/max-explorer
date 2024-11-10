<template>
  <div class="flex flex-row h-14">
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
      class: '!rounded-l-lg',
    },
  },
})

const returnCalendar = ref({
  pcInputText: {
    root: {
      class: '!rounded-r-lg',
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
}
</style>
