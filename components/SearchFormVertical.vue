<template>
  <form @submit.prevent="research" class="flex flex-col gap-4 w-full bg-white shadow-md rounded-md p-6">
    <h2 class="text-xl text-blue-800 font-bold text-center mb-4">Recherchez vos billets</h2>

    <div>
      <label class="block text-gray-700 mb-2" for="departureStation">Ville de départ</label>
      <InputText v-model="departureStation" placeholder="Gare ou ville" class="w-full"/>
    </div>

    <div>
      <label class="block text-gray-700 mb-2" for="destinationStation">Ville d'arrivée (optionnel)</label>
      <InputText v-model="destinationStation" placeholder="Gare ou ville" class="w-full"/>
    </div>

    <div>
      <label class="block text-gray-700 mb-2" for="departureDate">Date de départ</label>
      <Calendar v-model="departureDate" :showIcon="true" dateFormat="dd/mm/yy" class="w-full"/>
    </div>

    <div>
      <label class="block text-gray-700 mb-2" for="returnDate">Date de retour</label>
      <Calendar v-model="returnDate" :showIcon="true" dateFormat="dd/mm/yy" class="w-full"/>
    </div>

    <Button type="submit" label="Rechercher les meilleurs prix" class="w-full"/>
  </form>
</template>

<script setup>
const { departureStation, destinationStation, departureDate, returnDate, research } = useSearchForm()
</script>