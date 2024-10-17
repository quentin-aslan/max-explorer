<template>
  <section class="w-full flex flex-col gap-4">
    <div class="text-sm">
      Total Count : <span class="font-semibold">{{ trains.length }}</span>
    </div>

    <div
    v-for="train in trains" :key="train.id" class="md:hidden"
         :class="[
            'flex flex-col lg:flex-row gap-2 p-4 md:p-1 border',
            {'bg-gray-100 opacity-40 border-gray-300': train.od_happy_card === 'NON'},
            {'bg-gray-white border-2': train.od_happy_card === 'OUI'},
            ]">
      <span class="text-sm">Train <span class="font-semibold">{{ train.train_no }}</span></span>
      <span><span class="font-bold">{{ train.heure_depart }}</span> - {{ train.origine }}</span>
      <span><span class="font-bold">{{ train.heure_arrivee }}</span> - {{ train.destination }}</span>
    </div>

    <DataTable class="hidden md:block" :value="trains" striped-rows>
      <Column field="train_no" header="#"/>
      <Column field="origine" header="Départ"/>
      <Column field="heure_depart" header="Heure de Départ"/>
      <Column field="destination" header="Arrivée  "/>
      <Column field="heure_arrivee" header="Heure d'Arrivée"/>
    </DataTable>
  </section>
</template>

<script lang="ts" setup>
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