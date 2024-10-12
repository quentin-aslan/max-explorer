<template>
  <form @submit.prevent="onSubmit" class="flex flex-col md:flex-row md:items-end gap-4">
    <!-- Gare de départ -->
    <div class="w-full md:w-1/3">
      <span class="p-input-icon-left w-full">
        <i class="pi pi-map-marker"></i>
        <InputText v-model="departureStation" placeholder="Gare de départ" class="w-full" />
      </span>
    </div>
    <!-- Date de départ -->
    <div class="w-full md:w-1/3">
      <Calendar v-model="departureDate" placeholder="Date de départ" dateFormat="dd/mm/yy" class="w-full" />
    </div>
    <!-- Date de retour -->
    <div class="w-full md:w-1/3">
      <Calendar v-model="returnDate" placeholder="Date de retour" dateFormat="dd/mm/yy" class="w-full" />
    </div>
    <!-- Bouton de soumission -->
    <div class="w-full md:w-auto">
      <Button label="Rechercher" type="submit" class="w-full md:w-auto" />
    </div>
  </form>
</template>

<script setup lang="ts">
import { defineModel } from 'vue';
import InputText from 'primevue/inputtext';
import Calendar from 'primevue/calendar';
import Button from 'primevue/button';

const departureStation = defineModel<string>('departureStation', {
  required: true,
});

const departureDate = defineModel<Date | null>('departureDate', {
  required: true,
});

const returnDate = defineModel<Date | null>('returnDate', {
  required: false,
});

const emit = defineEmits(['submit']);

const onSubmit = () => {
  emit('submit');
};
</script>

<style scoped>
/* Styles spécifiques au composant */
</style>
