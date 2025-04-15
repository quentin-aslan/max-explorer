<template>
  <div class="flex items-start space-x-4 relative">
    <!-- Train Icon Container (Smaller Black Circle) -->
    <div class="flex items-center justify-center w-8 h-8 bg-max-pri rounded-full">
      <!-- Inline SVG Icon, smaller inside the circle -->
      <div
        class="text-white"
        v-html="trainIcon"
      />
    </div>

    <!-- Vertical line -->
    <div
      v-if="isLast"
      class="absolute bg-max-sec"
      style="width: 2px; height: 2.5rem; bottom: 2rem; left: -0.04rem;"
    />
    <!-- Train Details -->
    <div>
      <div class="text-xl text-max-pri font-sans-semibold">
        <span>{{ train.departureDateTime.toFormat('HH:mm') }}</span>
        <span class="text-base font-sans-italic"> Train n° {{ train.trainNo }}</span>
      </div>
      <div class="text-sm text-max-pri font-sans-semibold">
        <span>{{ train.origin }}</span>
      </div>
      <!-- End Station -->
      <div
        v-if="isLast"
        class="relative items-center space-x-2 mt-2"
      >
        <div class="flex ">
          <span
            class="w-2 h-2 rounded-full bg-max-pri"
            style="position: absolute; top: 1rem; left: -2.24rem;"
          /> <!-- Dot for end station -->
          <div>
            <div class="text-xl text-max-pri font-sans-semibold">
              {{ train.arrivalDateTime.toFormat('HH:mm') }}
              <span
                v-if="isNightTrain"
                class="text-base font-sans"
              >
                - {{ train.arrivalDateTime.toFormat('HH:mm') }} |
                <span class="border-b-max-action border-b-4">TRAIN DE NUIT</span>
              </span>
            </div>
            <div class="text-sm text-max-pri font-sans-semibold">
              {{ train.destination }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'
import trainIcon from 'assets/icons/train.svg?raw'
import type { TrainViewModel } from '~/domains/trips/entities/view-models/train.view-model'

type Props = {
  train: TrainViewModel
  isLast?: boolean
}

const props = defineProps<Props>()

const isNightTrain = computed(() => props.train.axe === 'IC NUIT') // TODO: Should be in the presenter.
</script>
