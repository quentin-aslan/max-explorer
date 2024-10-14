<template>
  <form
      @submit.prevent="() => { research(); expandForm = false; }"
      class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 w-full bg-white rounded-lg p-6"
  >
    <!-- Ville de départ -->
    <div class="w-full lg:w-auto relative">
      <label class="block text-gray-700 mb-2" for="departureStation">Ville de départ</label>
        <InputText
            v-model="departureStation"
            @focus="expandForm = true"
            @click="expandForm = !expandForm"
            placeholder="Toulouse Matabiau"
            class="w-full p-4"
        />
      <span v-if="!expandForm || isMobile" class="lg:hidden text-sm"> ⬇ Cliquez pour afficher les autres parametres ⬇ </span>
    </div>

    <!-- Hide by default on mobile -->
    <transition v-if="expandForm || !isMobile" name="fade" mode="out-in">
      <div class="w-full lg:w-auto relative">
        <label class="block text-gray-700 mb-2" for="destinationStation">Ville d'arrivée (optionnel)</label>
          <InputText v-model="destinationStation" placeholder="Brest" class="w-full p-4" />
      </div>
    </transition>

    <transition v-if="expandForm || !isMobile" name="fade" mode="out-in">
      <div class="w-full lg:w-[15%] relative">
        <label class="block text-gray-700 mb-2" for="departureDate">Date de départ</label>
        <Calendar
            v-model="departureDate"
            :showIcon="true"
            dateFormat="dd/mm/yy"
            class="w-full"
        />
      </div>
    </transition>

    <transition v-if="expandForm || !isMobile" name="fade" mode="out-in">
      <div class="w-full lg:w-[15%] relative">
        <label class="block text-gray-700 mb-2" for="returnDate">Date de retour</label>
        <Calendar
            v-model="returnDate"
            :showIcon="true"
            dateFormat="dd/mm/yy"
            class="w-full"
        />
      </div>
    </transition>

    <transition v-if="expandForm || !isMobile" name="fade" mode="out-in">
      <div class="w-full h-full lg:w-auto relative mt-8">
        <Button type="submit" label="Rechercher !" class="w-full"/>
      </div>
    </transition>


  </form>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// Variables venant du composable
const { departureStation, destinationStation, departureDate, returnDate, research } = useSearchForm()

// Variable pour suivre si le formulaire est "expand"
const expandForm = ref(false)

// Détection si on est sur mobile
const isMobile = ref(false)
onMounted(() => {
  const checkMobile = () => {
    isMobile.value = window.innerWidth <= 1024
  }
  checkMobile()
  window.addEventListener('resize', checkMobile)
})
</script>

<style>
/* Transition pour afficher/masquer les champs */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
