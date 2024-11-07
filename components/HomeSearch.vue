<template>
  <form
    class="flex flex-col gap-8 w-full bg-max-bg border border-max-sec rounded-3xl p-3 lg:p-12"
    @submit.prevent="research"
  >
    <h2 class="text-xl text-max-pri text-center font-sans-bold mb-4">
      Recherche
    </h2>

    <StationInput
      v-model="departureStation"
      placeholder="Depuis la ville de . . ."
    />

    <StationInput
      v-model="destinationStation"
      placeholder="Arrivée (optionnel)"
    />

    <MaxCalendar
      v-model:departure-date="departureDate"
      v-model:return-date="returnDate"
    />
    <MaxButton button-name="Allons-y !" />
  </form>
</template>

<script setup>
const { departureStation, destinationStation, departureDate, returnDate, research } = useSearchForm()
</script>

<style scoped>
</style>
