<template>
  <section class="w-full lg:w-2/3 flex flex-col gap-4">
    <div class="text-sm">
      Total Count : <span class="font-semibold">{{ trains.length }}</span>
    </div>
    <div
        v-for="train in trains"
        :key="train.id"
        :class="[
        'flex flex-col gap-2 p-4 border rounded duration-150 hover:-translate-x-1 hover:shadow cursor-pointer',
        { 'bg-gray-100 opacity-40 border-gray-300': train.od_happy_card === 'NON' },
        { hidden: !isFullDisplayed && train.od_happy_card === 'NON' },
        { 'bg-gray-white border-2': train.od_happy_card === 'OUI' },
      ]"
        @click="onTrainClick(train)"
    >
      <div class="flex flex-row justify-between">
        <h2 class="text-gray-500">
          <span class="font-bold">{{ train.heure_depart }}</span> - {{ train.origine }} ({{ train.origine_iata }})
        </h2>
        <span class="text-sm">
          Train Number: <span class="font-semibold">{{ train.train_no }}</span>
        </span>
      </div>
      <h2 class="font-bold">
        <span>{{ train.heure_arrivee }}</span> - {{ train.destination }} ({{ train.destination_iata }})
      </h2>
    </div>
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