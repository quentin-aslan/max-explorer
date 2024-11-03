<template>
  <form
    class="flex flex-col lg:items-center gap-4 w-full rounded-lg p-6"
    @submit.prevent="() => { research(); expandForm = false; emit('research') }"
  >
    <!-- Ville de départ -->

    <div class="flex space-x-5">
      <h1 class="text-xl text-max-pri font-sans-bold flex-none content-center">
        Max Explorer
      </h1>

      <StationInput
        v-model="departureStation"
        placeholder="Départ"
      />

      <StationInput
        v-model="destinationStation"
        placeholder="Arrivée (optionnel)"
      />

      <MaxCalendar
        v-model:departure-date="departureDate"
        v-model:return-date="returnDate"
      />

      <button
        type="submit"
        class="text-white bg-max-action font-sans-semibold rounded-lg text-xl px-5 py-2.5 focus:outline-none"
      >
        OK
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useIsMobile } from '~/composables/use-is-mobile'
// Variables venant du composable
const { departureStation, destinationStation, departureDate, returnDate, research } = useSearchForm()

// Variable pour suivre si le formulaire est "expand"
const expandForm = ref(false)

const { isMobile } = useIsMobile()

const emit = defineEmits(['research'])
</script>

<style scoped>

</style>
