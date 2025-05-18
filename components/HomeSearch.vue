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
          @valid-change="isDepartureValid = $event"
        />

        <StationInput
          v-model="destinationStation"
          placeholder="Arrivée (optionnel)"
          @valid-change="isDestinationValid = $event"
        />

        <MaxCalendar
          v-model:departure-date="departureDate"
          v-model:return-date="returnDate"
        />
        <MaxButton :disabled="!isFormValid">Allons-y !</MaxButton>
      </form>
    </template>

    <script setup>
    const { departureStation, destinationStation, departureDate, returnDate, research } = useSearchForm()

    const isDepartureValid = ref(false)
    const isDestinationValid = ref(true) // Destination est optionnelle

    const isFormValid = computed(() => {
      return isDepartureValid.value &&
             (destinationStation.value === '' || isDestinationValid.value) &&
             departureDate.value !== null
    })</script>
