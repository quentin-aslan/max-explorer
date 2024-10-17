<template>
  <form
      class="flex flex-col lg:flex-row lg:items-center gap-4 w-full bg-white rounded-lg p-6"
      @submit.prevent="() => { research(); expandForm = false; emit('research') }"
  >
    <!-- Ville de départ -->
    <div class="w-full lg:w-auto relative">
      <label class="block text-gray-700 mb-2" for="departureStation">Ville de départ</label>
        <InputText
            v-model="departureStation"
            placeholder="Toulouse Matabiau"
            class="w-full"
            @focus="expandForm = true"
            @click="expandForm = !expandForm"
        />
      <span v-if="!expandForm || isMobile" class="lg:hidden text-sm"> ⬇ Cliquez pour afficher les autres parametres ⬇ </span>
    </div>

    <!-- Hide for the explore research (DONC POUR LE MOMENT HIDE TOUT LE TEMPS) -->
    <transition name="fade" mode="out-in">
      <div v-if="expandForm || !isMobile" class="hidden w-full lg:w-auto relative">
        <label class="block text-gray-700 mb-2" for="destinationStation">Ville d'arrivée (optionnel)</label>
          <InputText v-model="destinationStation" placeholder="Brest" />
      </div>
    </transition>

    <transition name="fade" mode="out-in">
      <div v-if="expandForm || !isMobile" class="w-full lg:w-[15%] relative">
        <label class="block text-gray-700 mb-2" for="departureDate">Date de départ</label>
        <Calendar
            v-model="departureDate"
            :show-icon="true"
            date-format="dd/mm/yy"
            class="w-full"
        />
      </div>
    </transition>

    <transition name="fade" mode="out-in">
      <div v-if="expandForm || !isMobile" class="w-full lg:w-[15%] relative">
        <label class="block text-gray-700 mb-2" for="returnDate">Date de retour</label>
        <Calendar
            v-model="returnDate"
            :show-icon="true"
            date-format="dd/mm/yy"
            class="w-full"
        />
      </div>
    </transition>
    <transition name="fade" mode="out-in">
      <div v-if="expandForm || !isMobile" class="w-full h-full lg:w-auto relative mt-8">
        <Button type="submit" label="Rechercher !" class="w-full"/>
      </div>
    </transition>


  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {useIsMobile} from "~/composables/use-is-mobile";

// Variables venant du composable
const { departureStation, destinationStation, departureDate, returnDate, research } = useSearchForm()

// Variable pour suivre si le formulaire est "expand"
const expandForm = ref(false)

const { isMobile } = useIsMobile()

const emit = defineEmits(['research']);

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
