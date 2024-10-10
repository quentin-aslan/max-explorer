<template>
  <main class="flex flex-col gap-4 mx-10">
    <header>
      <h1 class="text-3xl font-bold">TGV MAAAX, EXPLORE TON PAYS !</h1>
    </header>

{{departureDate}}
    <form @submit.prevent="refreshResults" class="flex">
      <input id="origin" v-model="origin" type="text" placeholder="Ville de départ" class="input input-bordered w-full max-w-xs" required />
      <label for="departureDate">Date de départ</label>
      <input id="departureDate" v-model="departureDate" type="date" class="input input-bordered w-full max-w-xs">

      <label for="arrivalDate">Date d'arrivée</label>
      <input id="arrivalDate" v-model="arrivalDate" type="date">

      <button type="submit">Rechercher</button>
    </form>

    <section class="flex flex-col lg:flex-row gap-2">

      <section class="w-full lg:w-2/3 flex flex-col gap-4">
        <div class="text-sm">
          Total Count : <span class="font-semibold">{{ trains.length }}</span>
        </div>
        <div v-for="train in trains" @click="() => onTrainClick(train)"
        :class="[
            'flex flex-col gap-2 p-4 border rounded duration-150 hover:-translate-x-1 hover:shadow cursor-pointer ',
            {'bg-gray-100 opacity-40 border-gray-300': train.od_happy_card === 'NON'},
            {'hidden': !isFullDisplayed && train.od_happy_card === 'NON'},
            {'bg-gray-white border-2': train.od_happy_card === 'OUI'},
            ]">
          <div class="flex flex-row justify-between">
            <h2 class="text-gray-500"><span class="font-bold">{{ train.heure_depart }}</span> - {{ train.origine }}</h2>
          <span class="text-sm"> Train Number: <span class="font-semibold">{{ train.train_no }}</span></span>
          </div>
          <h2 class="font-bold"><span class="">{{ train.heure_arrivee }}</span> - {{ train.destination }}</h2>
        </div>
      </section>

      <section class="w-full lg:w-1/3 h-screen rounded bg-gray-200 flex items-center justify-center">
          <div class="text-3xl mx-10 text-center text-gray-400">
            Placeholder MAP
          </div>
      </section>
    </section>
  </main>

</template>
<script lang="ts" setup>
interface Train {
  id: number
  date: Date
  train_no: string
  entity: string
  axe: string
  origine_iata: string
  destination_iata: string
  origine: string
  destination: string
  heure_depart: string
  heure_arrivee: string
  od_happy_card: string
}
const trains = ref<Train[]>([])

const origin = ref('Toulouse')
const departureDate = ref(new Date().toString())
const arrivalDate = ref()
const isFullDisplayed = ref(false)

const onTrainClick = (train) => {
  console.log('train', train)
}

const refreshResults = async () => {
  const fetchTrainsURL = `/api/trains?origin=${origin.value}&departureDate=${departureDate.value}&arrivalDate=${arrivalDate.value}`
  const { data , status, error, refresh, clear }   = await useFetch(fetchTrainsURL)
  trains.value = data.value
}
</script>