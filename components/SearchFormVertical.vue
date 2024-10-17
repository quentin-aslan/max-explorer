<template>
  <form @submit.prevent="research" class="flex flex-col gap-4 w-full bg-white shadow-md rounded-md p-6">
    <h2 class="text-2xl text-blue-900 font-bold mb-4">Recherche ta prochaine destination !</h2>

    <div>
      <label class="block text-gray-700 mb-2" for="departureStation">Ville de départ</label>
      <InputText v-model="departureStation" placeholder="Gare ou ville" class="w-full"/>
    </div>

    <div class="hidden">
      <label class="block text-gray-700 mb-2" for="destinationStation">Ville d'arrivée (optionnel)</label>
      <InputText v-model="destinationStation" placeholder="Gare ou ville" class="w-full"/>
    </div>

    <div>
      <label class="block text-gray-700 mb-2" for="departureDate">Date de départ</label>
      <DatePicker v-model="departureDate" :minDate="departureDateMin" :maxDate="dateMax" :showIcon="true" dateFormat="dd/mm/yy" class="w-full"/>
    </div>

    <div>
      <label class="block text-gray-700 mb-2" for="returnDate">Date de retour</label>
      <DatePicker v-model="returnDate" :minDate="returnDateMin" :maxDate="dateMax"  :showIcon="true" dateFormat="dd/mm/yy" class="w-full"/>
    </div>

    <Button type="submit" label="Rechercher !" class="w-full"/>
  </form>
</template>

<script setup>
const { departureStation, destinationStation, departureDate, returnDate, research } = useSearchForm()

const departureDateMin = ref(new Date())
const returnDateMin = computed (() => departureDate.value ?? departureDateMin.value)
// 30 day from now because SNCF API only allows 30 days in the future
const dateMax = ref(new Date(new Date().setDate(new Date().getDate() + 30)));
</script>