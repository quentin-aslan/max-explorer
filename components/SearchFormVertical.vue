<template>
  <form
    class="flex flex-col gap-8 w-full bg-max-bg border border-max-sec rounded-3xl p-3 lg:p-12"
    @submit.prevent="research"
  >
    <h2 class="text-xl text-max-pri text-center font-sans-bold mb-4">
      Recherche
    </h2>

    <div class="relative">
      <input
        id="departureStation"
        v-model="departureStation"
        type="text"
        class="block px-5 pb-3 pt-5 w-full font-sans-semibold text-max-pri bg-white rounded-lg border border-max-sec appearance-none
             dark:text-white focus:outline-none focus:ring-0 focus:border-max-pri peer"
        placeholder=""
      >
      <label
        for="departureStation"
        class="absolute start-5 text-max-sec font-sans-semibold text-xl duration-300
      transform-translate-y-4 scale-50 top-0 z-10 origin-[0] peer-placeholder-shown:scale-100
      peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-4 peer-focus:scale-75 peer-focus:-translate-y-4"
      >
        Depuis la ville de . . .</label>
    </div>

    <div class="hidden">
      <label
        class="block text-gray-700 mb-2"
        for="destinationStation"
      >Ville d'arrivée (optionnel)</label>
      <InputText
        v-model="destinationStation"
        placeholder="Gare ou ville"
        class="w-full"
      />
    </div>

    <div class="flex flex-row h-14">
      <Calendar
        v-model="departureDate"
        :min-date="departureDateMin"
        :max-date="dateMax"
        date-format="dd/mm/yy"
        class="w-full"
        placeholder="Départ"
        :dt="departureCalendar"
      />
      <Calendar
        v-model="returnDate"
        :min-date="returnDateMin"
        :max-date="dateMax"
        date-format="dd/mm/yy"
        class="w-full"
        placeholder="Retour"
        :dt="returnCalendar"
      />
    </div>
    <button
      type="submit"
      class="text-white bg-max-action font-sans-semibold rounded-lg text-xl px-5 py-2.5 focus:outline-none"
    >
      Allons-y !
    </button>
  </form>
</template>

<script setup>
const { departureStation, destinationStation, departureDate, returnDate, research } = useSearchForm()

const departureDateMin = ref(new Date())
const returnDateMin = computed(() => departureDate.value ?? departureDateMin.value)
// 30 day from now because SNCF API only allows 30 days in the future
const dateMax = ref(new Date(new Date().setDate(new Date().getDate() + 30)))

const departureCalendar = ref({
  colorScheme: {
    light: {
      inputtext: {
        borderRadius: '0 0 0 0', // bottom-left, top-left corners
        backgroundColor: 'black',
      },
    },
  },
})

const returnCalendar = ref({
  colorScheme: {
    light: {
      pcInputText: {
        //borderRadius: '0 10px 10px 0', // bottom-right, top-right corners
      },
    },
  },
})
</script>

<style scoped>
/* Change calendar input style */
:deep() .p-inputtext {
  @apply border-max-sec;
  @apply font-sans-semibold;
  @apply text-max-pri;
  border-radius: 0;
}
</style>
