<template>
  <section class="w-full flex flex-col gap-4">
    <div class="text-sm">
      Total Count : <span class="font-semibold">{{ trains.length }}</span>
    </div>
    <DataTable :value="trains" tableStyle="min-width: 50rem" stripedRows>
      <Column field="train_no" header="#"></Column>
      <Column field="origine" header="Départ"></Column>
      <Column field="heure_depart" header="Heure de Départ"></Column>
      <Column field="destination" header="Arrivée  "></Column>
      <Column field="heure_arrivee" header="Heure d'Arrivée"></Column>
    </DataTable>
  </section>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue';
import type {Train} from "~/types";
const props = defineProps<{
  trains: Train[];
  isFullDisplayed: boolean;
}>();

const emit = defineEmits(['trainClick']);

const onTrainClick = (train: Train) => {
  emit('trainClick', train);
};
</script>